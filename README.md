# zJsonBin

Json serialization/deserialization


## Principle
  Register the json serialization/deserialization lib
  in node or browser
  
  When the serialization is executed the object will be stringify first, then reformatted to decrease density, finally compressed.
  The result is the zjson formatted data.
  
 ## install
 ```shell
$ npm install git://github.com/z-open/zjsonbin
```

```shell
$ bower install z-open/zjsonbin
```


 ## Basic Usage
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
  
 ## Options
 ### debug
   to see the performance during runtime,
   
  in the browser code
  ZJSONBIN.debug=true or 2
  
  In node
  zjsonbin = require('zjsonbin')
  zjsonbin.debug = true 
  
  ### disabled
  
  ZJONBIN.disabled = true;
  zjsonbin.disabled = true;
  

 ## Contribute
 ### Recommendation
 When enhancing this lib, recommendation
  is to npm link and bower link zjonbin
  so that anychange to the code will be reflected in the app.
  
 ### TODOS 
  - Performance must be improved.
  - Encoding only supports UTF8.
  - console Log is not efficient and make difficult to figure out whatn data has been serialized or deserialized
  - the zjon format should carry some flag (is it compressed and needs decompression) to optimized deserialization work.
  - dictionary index is 32based... not optimum where there is more than 32 field names in the object.
  - bjson could be implemented instead msgpack-lite. other gzip-based libs were not efficient compression as it would not optimize the javascript obj.
  


 
