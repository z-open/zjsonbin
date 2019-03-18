const zjsonbin = require('../../lib/zjson-bin.js');

describe('zjsonbin', () => {
  beforeEach(() => {
    zjsonbin.disabled = false;
    zjsonbin.debug = true;
  });

  it('should return the same object after deserialization', () => {
    const obj = {lastname: 'you', firstname: 'John'};
    const ser = zjsonbin.serialize(obj);
    const r = zjsonbin.deserialize(ser);
    expect(obj).toEqual(r);
  });

  fit('should handle null and undefined array values', () => {
    const obj = {
      lastname: 'you',
      firstname: 'John',
      items: [
        'item 1',
        null,
        undefined,
        42,
        'item 2',
      ],
      property3: null,
    };

    const ser = zjsonbin.serialize(obj);
    const r = zjsonbin.deserialize(ser);
    expect(obj).toEqual(r);
  });

  it('should return the same object after deserialization and not crash', () => {
    const obj = {};
    for (let v = 0; v < 65000; v++) {
      obj['p' + v] = v;
    }
    const ser = zjsonbin.serialize(obj);
    const r = zjsonbin.deserialize(ser);
    expect(obj).toEqual(r);
  });

  it('should return null when serializing a null object', () => {
    expect(zjsonbin.serialize(null)).toEqual(null);
  });

  it('should return null when deserializing a null', () => {
    expect(zjsonbin.deserialize(null)).toEqual(null);
  });

  it('should return null when deserializing an empty string', () => {
    expect(zjsonbin.deserialize('')).toEqual(null);
  });

  it('should return the same value in disabled mode', () => {
    zjsonbin.disabled = true;
    const obj = {lastname: 'you', firstname: 'John'};
    const ser = zjsonbin.serialize(obj);
    expect(ser === obj);
    const r = zjsonbin.deserialize(ser);
    expect(r === obj);
  });
});
