/**
 * Register the json serialization/deserialization lib
 * in node or browser
 *
 * When the serialization is executed the object will be stringify first, then reformatted to decrease density, finally to compress
 * The result is the zjson formatted data.
 *
 * TODO:
 * - Log is not efficient to allow
 * - the zjon format should carry some flags (is it compressed and needs decompression)
 * - dictionary index is 32based... not optimum where there is more than 32 field names in the object.
 * - bjson could be implemented in msgpack-lite. other gzip-based libs were not efficient compression as it would not optimize the javascript obj.
 *
 * DEVELOPMENT
 * When enhancing this lib, recommendation
 * is to npm link and bower link zjonbin
 * so that anychange to the code will be reflected in the app.
 *
 * to see the performance during runtime,
 * in the browser code
 * ZJSONBIN.debug=true
 * In node
 * zjsonbin = require('zjsonbin')
 * zjsonbin.debug = true
 */
(
  function() {
    registerLib(this, factory);

    function factory(_, msgpack, logger) {
      'strict mode';

      const zjsonbin = {
        serialize,
        serializeToString: serialize,
        deserialize,
        deserializeFromString: deserialize,
        differenceBetween,
        mergeChanges,
        jsonify,
        debug: false
      };

      if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = zjsonbin;
      } else {
        this.ZJSONBIN = zjsonbin;
      }

      /**
       *
       * Serialize object.
       * during the process the object will be jsonify (toJSON inner objects will also be called) and optimized for size reduction (Dictionary)
       * then zipped.
       *
       * @param {Object} obj
       *
       * @returns {String} serializedData
       */
      function serialize(obj) {
        if (zjsonbin.disabled || _.isNil(obj)) {
          return obj;
        }
        let objLength;
        if (zjsonbin.debug === 2) {
          objLength = JSON.stringify(obj).length;
        }
        const start = Date.now();

        const cJson = pack(obj);
        const serializedObj = msgpack.encode(cJson);
        const string = abs2str(serializedObj);

        if (zjsonbin.debug === 2) {
          const compression = Math.round(Number(100 * string.length / objLength) * 10) / 10;
          logger.debug('Serialize object to size ' + getSizeFormat(string.length) + ', compressed to ' + compression + '% in ' + getTimeFormat(Date.now() - start));
        } else if (zjsonbin.debug) {
          logger.debug('Serialize object to size ' + getSizeFormat(string.length) + ' in ' + getTimeFormat(Date.now() - start));
        }
        return string;

        // const jsonText = JSON.stringify(obj);
        // const jsonT = Date.now();

        // const jsonParse = jsonify(obj);
        // const jsonP = Date.now();

        // const packed = msgpack.encode(jsonParse);
        // //jsonpack.pack(jsonParse);
        // const packedT = Date.now();
        // const compression = Math.round(Number(100 * packed.length / jsonText.length) * 10) / 10;

        // debug && logger.debug('Serialize object to size %b, compressed to %b - jtext %b - jparse %b - packed %b',
        //     getSizeFormat(packed.length), compression + '%',
        //     getTimeFormat(jsonT - start),
        //     getTimeFormat(jsonP - jsonT),
        //     getTimeFormat(packedT - jsonP));
        // return packed;
      }

      /**
       * Retrieve the json object from a string representation
       *
       * @param {String} stringData
       * @return {Object} obj
       */
      function deserialize(stringData) {
        if (zjsonbin.disabled || _.isEmpty(stringData)) {
          return null;
        }

        const start = Date.now();
        const serializedObj = str2ab(stringData);
        const compactJson = msgpack.decode(serializedObj);
        const obj = unpack(compactJson);
        zjsonbin.debug && logger.debug('Deserialized object of size ' +
          getSizeFormat(stringData.length) + ' in ' + getTimeFormat(Date.now() - start));

        return obj;
      }

      function getSizeFormat(v) {
        return (v > 1000 ? (Math.round(v / 10) / 100) + 'Kb' : v + 'b');
      }

      function getTimeFormat(lap) {
        return lap >= 1000 ? Math.round((lap) / 100) / 10 + 's' : lap + 'ms';
      }

      /**
       * take an object,
       * jsonify it and factor its property names (dictionary use) to reduce its size
       * @param {*} obj
       * @returns {Object} optimized json object
       */
      function pack(obj) {
        const dictionaryNames = {},
          dictionary = [];
        let n = 0;
        const r = _.cloneDeepWith(obj, processProperty);
        return [dictionary, r];

        function processProperty(objProperty) {
          if (objProperty && objProperty.toJSON) {
            objProperty = objProperty.toJSON();
          }
          if (_.isArray(objProperty)) {
            return _.map(objProperty, function(item) {
              if (_.isNil(objProperty)) {
                return null;
              }
              return _.cloneDeepWith(item, processProperty);
            });
          }
          if (_.isObject(objProperty)) {
            // Data coming in can use new Number(42) instead of 42
            if (_.isNumber(objProperty)) {
              return Number(objProperty);
            }
            // Data coming in can use new String('test') instead of 'test'
            if (_.isString(objProperty)) {
              return String(objProperty);
            }

            let property, d;
            const newObj = {};
            for (property in objProperty) {
              if (!_.isNil(objProperty[property]) && !_.isFunction(objProperty[property])) {
                d = dictionaryNames[property];
                if (_.isNil(d)) {
                  d = (n++).toString(36);
                  dictionaryNames[property] = d;
                  dictionary.push(property);
                }

                newObj[d] = _.cloneDeepWith(objProperty[property], processProperty);
              }
            }
            return newObj;
          }
          return objProperty;
        }
      }

      /**
       * take a packed(optimized) json object and unpack to recover its original form.
       *
       * @param {Object} packedObj
       */
      function unpack(packedObj) {
        const dictionary = packedObj[0];
        const r = _.cloneDeepWith(packedObj[1], processProperty);
        return r;

        function processProperty(objProperty) {
          if (_.isArray(objProperty)) {
            return _.map(objProperty, function(item) {
              if (_.isNil(objProperty)) {
                return null;
              }
              return _.cloneDeepWith(item, processProperty);
            });
          }
          if (_.isObject(objProperty)) {
            // console.log(objProperty.constructor.name);
            const newObj = {};
            for (let property in objProperty) {
              if (!_.isNil(objProperty[property]) && !_.isFunction(objProperty[property])) {
                let d = dictionary[parseInt(property, 36)];
                newObj[d] = _.cloneDeepWith(objProperty[property], processProperty);
              }
            }
            return newObj;
          }
          return objProperty;
        }
      }

      /**
       * Convert a string to a buffer
       *
       * note that this is only correct if your buffer only contains non-multibyte ASCII characters:
       *
       * @param {String} str
       *
       * @returns {Uint8Array}
       */
      function str2ab(str) {
        let buf = new ArrayBuffer(str.length); // 2 bytes for each char
        let bufView = new Uint8Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
          bufView[i] = str.charCodeAt(i);
        }
        return bufView;
      }

      /**
       * Convert a buffer to a string
       *
       * and prevent Maximum call stack size exceeded
       *
       * https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
       *
       * note that this is only correct if your buffer only contains non-multibyte ASCII characters:
       * @param {Uint8Array} u8a
       *
       * @return {String}
       */
      function abs2str(u8a) {
        let CHUNK_SZ = 0x8000;
        if (u8a.length < CHUNK_SZ) {
          return String.fromCharCode.apply(null, u8a);
        }

        let c = [];
        for (let i = 0; i < u8a.length; i += CHUNK_SZ) {
          c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
        }
        return c.join("");
      }

      /**
       * returns the json object version of an object.
       *
       * This will run all toJSON functions recursively if any
       * and return an object, not a string
       *
       * @param {Object} obj
       * @returns {Object} json object
       */
      function jsonify(obj) {
        return JSON.parse(JSON.stringify(obj));
      }

      /**
       * Find differences
       *
       * @param {Object} jsonObj1
       * @param {Object} jsonObj2
       * @returns {Object} witch contains the values and properties that where modified, added or deleted in jsonObj1 as compared with jsonObj2
       */
      function differenceBetween(jsonObj1, jsonObj2) {
        if (_.isEmpty(jsonObj1) && _.isEmpty(jsonObj2)) {
          return null;
        }
        const objDifferences = {};
        _.forEach(_.keys(jsonObj1), (property) => {
          if (['id', 'revision'].indexOf(property) !== -1) {
            // there is no need to compare this.
            return;
          }
          if (_.isArray(jsonObj1[property])) {
            const obj1Array = jsonObj1[property];
            const obj2Array = jsonObj2[property];
            if (_.isEmpty(obj2Array)) {
              if (obj1Array.length) {
                // add new array
                const result = removeNil(jsonObj1[property]);
                if (!_.isNil(result)) {
                  objDifferences[property] = result;
                }
              }
              // same empty array
              return;
            }

            if (!obj1Array.length) {
              if (!obj2Array.length) {
                // objects are both empty, so equals
                return;
              }
              // obj2 is not empty
              // so obj1 does not have its data
              objDifferences[property] = [];
              return;
            }

            // does obj1 has its content managed by ids
            if (_.isNil(obj1Array[0].id)) {
              // no it is just a big array of data
              if (!_.isEqual(obj1Array, obj2Array)) {
                const result = removeNil(obj1Array);
                if (!_.isNil(result)) {
                  objDifferences[property] = result;
                }
              }
              return;
            }

            // since objects have ids, let's dig in to get specific difference
            const rowDifferences = [];
            for (let obj1Row of obj1Array) {
              const id = obj1Row.id;
              const obj2Row = _.find(obj2Array, { id });
              if (obj2Row) {
                // is it updated?
                const r = differenceBetween(obj1Row, obj2Row);
                if (!_.isEmpty(r)) {
                  rowDifferences.push(_.assign({ id }, r));
                }
              } else {
                // row does not exist in the other obj
                const result = removeNil(obj1Row);
                if (!_.isNil(result)) {
                  rowDifferences.push(result);
                }
              }
            }
            // any row is no longer in obj1
            for (let obj2Row of obj2Array) {
              const id = obj2Row.id;
              const obj1Row = _.find(obj1Array, { id });
              if (!obj1Row) {
                rowDifferences.push({ id, $removed: true });
              }
            }
            if (rowDifferences.length) {
              objDifferences[property] = rowDifferences;
            }
          } else if (_.isObject(jsonObj1[property])) {
            // what fields of the object have changed?
            if (jsonObj2[property]) {
              const r = differenceBetween(jsonObj1[property], jsonObj2[property]);
              if (!_.isEmpty(r)) {
                objDifferences[property] = r;
              }
            } else {
              // field does not exist in obj2
              const result = removeNil(jsonObj1[property]);
              if (!_.isNil(result)) {
                objDifferences[property] = result;
              }
            }
          } else if (!_.isEqual(jsonObj1[property], jsonObj2[property])) {
            if (_.isNil(jsonObj1[property]) && !_.isNil(jsonObj2[property])) {
              // the property is now set to null
              objDifferences[property] = null;
            } else {
              // what value has changed. Is it valid?
              const result = removeNil(jsonObj1[property]);
              if (!_.isNil(result)) {
                objDifferences[property] = result;
              }
            }
          }
        });
        _.forEach(_.keys(jsonObj2), (property) => {
          if (_.keys(jsonObj1).indexOf(property) === -1) {
            objDifferences[property] = { $removed: true };
          }
        });
        return _.isEmpty(objDifferences) ? null : objDifferences;
      }

      function removeNil(jsonObj) {
        if (_.isArray(jsonObj)) {
          const newArray = [];
          for (let objRow of jsonObj) {
            const result = removeNil(objRow);
            if (!_.isNil(result)) {
              newArray.push(result);
            }
          }
          return newArray;
        }
        if (_.isObject(jsonObj)) {
          const newObj = {};
          _.forEach(_.keys(jsonObj), (property) => {
            if (!_.isNil(jsonObj[property])) {
              const result = removeNil(jsonObj[property]);
              if (!_.isNil(result)) {
                newObj[property] = result;
              }
            }
          });
          return newObj;
        }
        return jsonObj;
      }

      /**
       * Apply changes to jsonObj collected thru the function differenceBetween
       *
       * @param {Object} jsonObj
       * @param {Object} changes
       * @returns {object} with the changes applied to jsonObj
       */
      function mergeChanges(jsonObj, changes) {
        _.forEach(changes, (newValue, property) => {
          if (property === 'id') {
            // id will never be different. they are just here to identity rows that contains new values
            return;
          }
          if (_.isArray(newValue)) {
            const changeArray = newValue;
            if (changeArray.length === 0 || _.isNil(changeArray[0].id)) {
              // a  array value is the new value
              // There is no id in the items, so there is no granular change.
              jsonObj[property] = changeArray;
            } else {
              _.forEach(changeArray, (changeRow) => {
                const objRow = _.find(jsonObj[property], { id: changeRow.id });
                if (objRow) {
                  if (changeRow.$removed) {
                    _.remove(jsonObj[property], objRow);
                  } else {
                    mergeChanges(objRow, changeRow);
                  }
                } else {
                  // array does not exist in destination?
                  if (_.isNil(jsonObj[property])) {
                    jsonObj[property] = [];
                  } else if (!_.isArray(jsonObj[property])) {
                    throw new Error(`Property ${property} in the change object is an array but merged object property has a different type.`);
                  }
                  jsonObj[property].push(changeRow);
                }
              });
            }

            return;
          }
          if (_.isObject(newValue)) {
            if (newValue.$removed) {
              delete jsonObj[property];
            } else {
              // create new object if needed
              // then add/edit/remove properties recursively
              jsonObj[property] = mergeChanges(jsonObj[property] || {}, newValue);
            }
          } else {
            jsonObj[property] = newValue;
          }
        });
        return jsonObj;
      }
    }

    function registerLib(global, factory) {
      let logger;
      if (typeof exports === "object" && typeof module !== "undefined") {
        // register for node
        logger = require('zimit-zlog').getLogger('zjsonbin');
        logger.setLevel('all');
        factory(require("lodash"), require("msgpack-lite"), logger);
      } else if (typeof define === "function" && define.amd) {
        // not tested.
        logger = { debug: console.debug };
        define(["_", "msgpack-lite"], logger, function(lodash, msgpack) {
          factory(lodash, msgpack, logger);
        });
      } else {
        // register lib for browser if dependency are loaded.
        logger = { debug: console.debug };
        factory(global._, global.msgpack, logger);
      }
    }
  }
)();
