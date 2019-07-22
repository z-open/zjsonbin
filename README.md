# zJsonBin

Json serialization/deserialization Tool Set


## Principle
  Register the json serialization/deserialization lib
  in node or browser
  
  ### Serialialization
  When the serialization is executed the object will be stringify first, then reformatted to decrease density, finally compressed.
  The result is the zjson formatted data.

  ### Incremental Changes
  To decrease the payload on network, incremental changes will provide a substantial advantage. The recipient must have the original object before the changes made by the sender.
  The lib functions will provide the changes made to an object origin and the function to merge the changes to the object origin. 

  A revision tracking system will need to be implementated to be sure that the changes are merge to the correct object state.

  
 ## install
 ```shell
$ npm install git://github.com/z-open/zjsonbin
```

```shell
$ bower install z-open/zjsonbin
```


 ## Basic Serialization Usage
  ### In node,
  ```javascript
  const zjsonbin = require('zjsonbin');
  const obj = {title:'Big Object',content:'Huge'}
  const ser = zjsonbin.serialize(obj);
  console.log(zjsonbin.deserialize(ser));
  ```
  ### In browser,
  ```javascript
  const obj = {title:'Big Object',content:'Huge'}
  const ser = ZJSONBIN.serialize(obj);
  console.log(ZJSONBIN.deserialize(ser));
  ```
  
 ### Options
 #### debug
   to see the performance during runtime,
   
  in the browser code
  ZJSONBIN.debug=true or 2
  
  In node
  zjsonbin = require('zjsonbin')
  zjsonbin.debug = true 
  
  #### disabled
  
  ZJONBIN.disabled = true;
  zjsonbin.disabled = true;


 ## Basic Serialization Usage
  ### Example
 
  ```javascript
  const jsonObjOrig = {title:'Big Object',content:'Huge', items:[{id:'1':'mini'},{id:'2':'small'}]}
  const jsonObjModified = {title:'Bigger Object',content:'Huge', items:[{id:'1':'minimal'},{id:'3':'medium'}]}
  const changes = zjsonbin.differenceWith(jsonObjModified,jsonObjOrig);
  console.log(zjsonbin.mergeChanges(jsonObjOrig,changes);
  ```
  
  ### Note
  Object should have id to calculate optimum changes in arrays.
  make sure that the object to be transported is a plain json object, with no functions if needed and has no circular dependency.
  
  Ex: jsonObjOrig = JSON.parse(JSON.stringify(myComplexObject))


 ## Contribute
 ### Recommendation
 When enhancing this lib, recommendation
  is to npm link and bower link zjonbin
  so that anychange to the code will be reflected in the app.
  
 ### TODOS 
  - Performance could be improved.
  - trigger compression on size threshold.
  - Encoding only supports UTF8.
  - console Log is not efficient and make difficult to figure out whatn data has been serialized or deserialized
  - the zjon format should carry some flag (is it compressed and needs decompression) to optimized deserialization work.
  - dictionary index is 32based... not optimum where there is more than 32 field names in the object.
  - bjson could be implemented instead msgpack-lite. other gzip-based libs were not efficient compression as it would not optimize the javascript obj.
  - serialize or lib could receive options (ex  enable/disable compression,  compression:to provide function, enable/disable dictionary, output: buffer or other, default string..)
  - deserialize or lib could aslo receive options (decompression: to provide decompression function)
  - incremental changes could remove the need for id in objects in array.
  
  


 
