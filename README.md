
Json serialization/deserializaiton

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