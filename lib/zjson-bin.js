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
(function () {

    registerLib(this, factory);

    function factory(_, msgpack, logger) {
        'strict mode';

        const zjsonbin = {
            serialize,
            serializeToString,
            deserialize,
            deserializeFromString
        };

        if (typeof exports === "object" && typeof module !== "undefined") {
            module.exports = zjsonbin;
        }
        else {
            this.ZJSONBIN = zjsonbin;
        }
        /**
         * 
         * Serialize object. 
         * during the process the object will be jsonify (toJSON inner objects will also be called) and optimized for size reduction (Dictionary)
         * then zipped.
         * 
         * @param {*} obj 
         * @param {*} debug 
         * 
         * @returns {Uint8Array}
         */
        function serialize(obj) {
            if (_.isNil(obj)) {
                return;
            }
            const start = Date.now();

            const cJson = pack(obj);
            const serializedObj = msgpack.encode(cJson);
            zjsonbin.debug && logger.debug('Serialized object to size ' +
                getSizeFormat(serializedObj.length) + ' in ' + getTimeFormat(Date.now() - start));
            return serializedObj;

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
         * Serialize an object to a string
         * @param {Object} obj 
         */
        function serializeToString(obj) {
            const buff = serialize(obj);
            return String.fromCharCode.apply(null, buff);
        }

        /**
         * 
         * @param {Uint8Array} serializedObj 
         * @return {json}
         */
        function deserialize(serializedObj) {
            if (_.isNil(serializedObj)) {
                return;
            }
            if (!(serializedObj instanceof Uint8Array)) {
                serializedObj = new Uint8Array(serializedObj);
            }
            const cJson = msgpack.decode(serializedObj);
            return unpack(cJson);
        }

        /**
         * Retrieve the json object from a string representation
         * 
         * @param {String} stringData 
         * @return {Object} jsonObject
         */
        function deserializeFromString(stringData) {
            if (_.isNil(stringData)) {
                return;
            }
            const serializedObj = str2ab(stringData)
            const cJson = msgpack.decode(serializedObj);
            return unpack(cJson);
        }

        function getSizeFormat(v) {
            return (v > 1000 ? (Math.round(v / 10) / 100) + 'Kb' : v + 'b')
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
            const dictionaryNames = {}, dictionary = [];
            let n = 0;
            const r = _.cloneDeepWith(obj, processProperty);
            return [dictionary,r];

            function processProperty(objProperty) {
                if (objProperty.toJSON) {
                    objProperty = objProperty.toJSON();
                }
                if (_.isArray(objProperty)) {
                    return _.map(objProperty, function (item) {
                        if (_.isNil(objProperty)) {
                            return null;
                        }
                        return _.cloneDeepWith(item, processProperty);
                    })
                }
                if (_.isObject(objProperty)) {
                    const newObj = {};
                    for (var property in objProperty) {
                        if (!_.isNil(objProperty[property]) && !_.isFunction(objProperty[property])) {
                            var d = dictionaryNames[property];
                            if (d == null) {
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
            };
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
                    return _.map(objProperty, function (item) {
                        if (_.isNil(objProperty)) {
                            return null;
                        }
                        return _.cloneDeepWith(item, processProperty);
                    });
                }
                if (_.isObject(objProperty)) {
                    //console.log(objProperty.constructor.name);
                    const newObj = {};
                    for (var property in objProperty) {
                        if (!_.isNil(objProperty[property]) && !_.isFunction(objProperty[property])) {
                            var d = dictionary[parseInt(property, 36)];
                            newObj[d] = _.cloneDeepWith(objProperty[property], processProperty);
                        }
                    }
                    return newObj;
                }
                return objProperty;
            };

        }

        function str2ab(str) {
            var buf = new ArrayBuffer(str.length); // 2 bytes for each char
            var bufView = new Uint8Array(buf);
            for (var i = 0, strLen = str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return bufView;
        }
    }

    function registerLib(global, factory) {
        if (typeof exports === "object" && typeof module !== "undefined") {
            // register for node
            var logger = require('zlog').getLogger('zjsonbin');
            logger.setLevel('all')
            factory(require("lodash"), require("msgpack-lite"), logger)
        } else if (typeof define === "function" && define.amd) {
            // not tested. 
            var logger = { debug: console.debug };
            define(["_", "msgpack-lite"], logger, function (lodash, msgpack) {
                factory(lodash, msgpack, logger);
            })
        } else {
            // register lib for browser if dependency are loaded.
            var logger = { debug: console.debug };
            factory(global._, global.msgpack, logger);
        }
    }
})();
