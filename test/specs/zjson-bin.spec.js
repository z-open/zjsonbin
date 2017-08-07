const zjsonbin = require('../../lib/zjson-bin.js');

describe('zjsonbin', function() {
  beforeEach(function() {
    zjsonbin.disabled = false;
    zjsonbin.debug = true;
  });

  it('should return the same object after deserialization', function() {
    const obj = {lastname: 'you', firstname: 'John'};
    const ser = zjsonbin.serialize(obj);
    const r = zjsonbin.deserialize(ser);
    expect(obj).toEqual(r);
  });

  it('should return the same object after deserialization and not crash', function() {
    const obj = {};
    for (let v = 0; v < 65000; v++) {
      obj['p' + v] = v;
    }
    const ser = zjsonbin.serialize(obj);
    const r = zjsonbin.deserialize(ser);
    expect(obj).toEqual(r);
  });

  it('should return null when serializing a null object', function() {
    expect(zjsonbin.serialize(null)).toEqual(null);
  });

  it('should return null when deserializing a null', function() {
    expect(zjsonbin.deserialize(null)).toEqual(null);
  });

  it('should return null when deserializing an empty string', function() {
    expect(zjsonbin.deserialize('')).toEqual(null);
  });

  it('should return the same value in disabled mode', function() {
    zjsonbin.disabled = true;
    const obj = {lastname: 'you', firstname: 'John'};
    const ser = zjsonbin.serialize(obj);
    expect(ser === obj);
    const r = zjsonbin.deserialize(ser);
    expect(r === obj);
  });
});
