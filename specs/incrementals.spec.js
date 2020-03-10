'use strict';
const syncHelper = require('../lib/zjson-bin.js');
const _ = require('lodash');

class Resource {
  constructor(obj) {
    _.assign(this, _.clone(obj));
  }
  doSomething() {
    return 'something';
  }
  toJSON() {
    return {
      id: this.id,
      firstname: this.firstname
    };
  }
}

class SomeObject {
  constructor(obj) {
    _.assign(this, _.clone(obj));
  }
  doSomething() {
    return 'something';
  }
  toJSON() {
    const r = _.clone(this);
    return r;
  }
}

describe('jsonify function', function() {
  it('should return a json object running deep toJSON functions', () => {
    const obj = new SomeObject({
      name: 'Minolo',
      tracks: [
        {
          id: 1,
          display: 'Requirement',
          resources: [
            new Resource({ id: 1, firstname: 'pedro', lastname: 'offshool' }),
            new Resource({ id: 2, firstname: 'pablo', lastname: 'guardor' }),
            new Resource({ id: 3, firstname: 'john', lastname: 'toli' })
          ]
        },
        {
          id: 2,
          display: 'Implementation',
          resources: [
            new Resource({ id: 1, firstname: 'thomas', lastname: 'offshool' })
          ]
        }
      ],
      revision: 1
    });

    const jsonObj = syncHelper.jsonify(obj);

    expect(jsonObj).toEqual({
      name: 'Minolo',
      tracks: [
        {
          id: 1,
          display: 'Requirement',
          resources: [
            { id: 1, firstname: 'pedro' },
            { id: 2, firstname: 'pablo' },
            { id: 3, firstname: 'john' }
          ]
        },
        {
          id: 2,
          display: 'Implementation',
          resources: [
            { id: 1, firstname: 'thomas' }
          ]
        }
      ],
      revision: 1
    });
  });
});

describe('Incrementals', function() {
  it('get simple obj property differences', function() {
    const originalObject = {
      id: 'obj1',
      name: 'Minolo',
      owner: {},
      status: null,
      settings: { param1: 'one', param2: 'two' },
      revision: 1
    };

    const updatedObject = _.cloneDeep(originalObject);
    updatedObject.name = 'Maxolo';
    updatedObject.settings = { param1: '1' };
    updatedObject.options = { show: true };

    const change = syncHelper.differenceBetween(updatedObject, originalObject);

    expect(change).toEqual(
      {
        name: 'Maxolo',
        settings: {
          param1: '1',
          param2: {
            $removed: true
          }
        },
        // added object
        options: { show: true }
      }
    );

    const obj = _.cloneDeep(originalObject);
    const syncedObj = syncHelper.mergeChanges(obj, change);
    // but syncedObj would not have comment since it was null
    delete updatedObject.description;
    expect(syncedObj).toEqual(updatedObject);
  });

  it('get simple obj property differences when property with null value is set with a new ID obj', function() {
    const originalObject = {
      id: 'obj1',
      name: 'Maxolo',
      owner: null,
      status: null,
      settings: { param1: '1' },
      revision: 1
    };

    const updatedObject = _.cloneDeep(originalObject);
    updatedObject.owner = { id: 3, display: 'Thomas' };

    const change = syncHelper.differenceBetween(updatedObject, originalObject);

    expect(change).toEqual(
      {
        owner: { id: 3, display: 'Thomas' }
      }
    );

    const obj = _.cloneDeep(originalObject);
    const syncedObj = syncHelper.mergeChanges(obj, change);
    // but syncedObj would not have comment since it was null
    delete updatedObject.description;
    expect(syncedObj).toEqual(updatedObject);
  });

  it('get simple obj property differences when property with ID object is set to null', function() {
    const originalObject = {
      id: 'obj1',
      name: 'Maxolo',
      owner: { id: 3, display: 'Thomas' },
      status: null,
      settings: { param1: '1' },
      revision: 1
    };

    const updatedObject = _.cloneDeep(originalObject);
    updatedObject.owner = null;

    const change = syncHelper.differenceBetween(updatedObject, originalObject);

    expect(change).toEqual(
      {
        owner: null
      }
    );

    const obj = _.cloneDeep(originalObject);
    const syncedObj = syncHelper.mergeChanges(obj, change);
    // but syncedObj would not have comment since it was null
    delete updatedObject.description;
    expect(syncedObj).toEqual(updatedObject);
  });

  it('get simple obj property differences when property with a simple object is set to null', function() {
    const originalObject = {
      id: 'obj1',
      name: 'Maxolo',
      owner: { id: 3, display: 'Thomas' },
      status: null,
      settings: { param1: '1' },
      revision: 1
    };
    const updatedObject = _.cloneDeep(originalObject);
    updatedObject.settings = null;

    const change = syncHelper.differenceBetween(updatedObject, originalObject);
    expect(change).toEqual(
      {
        settings: null
      }
    );

    const obj = _.cloneDeep(originalObject);
    const syncedObj = syncHelper.mergeChanges(obj, change);
    // but syncedObj would not have comment since it was null
    delete updatedObject.description;
    expect(syncedObj).toEqual(updatedObject);
  });

  it('get simple obj array differences', function() {
    const originalObject = {
      name: 'Minolo',
      roles: [],
      tracks: [
        {
          id: 1,
          display: 'Requirement'
        },
        {
          id: 2,
          display: 'Implementation'
        }
      ],
      revision: 1
    };

    const updatedObject = _.cloneDeep(originalObject);
    // update an array
    updatedObject.tracks = [
      {
        id: 1,
        display: 'Requirement Phase',
        description: null
      }
    ];
    // add new array
    updatedObject.partners = [
      { id: '12', name: 'john' }
    ];

    const change = syncHelper.differenceBetween(updatedObject, originalObject);

    expect(change).toEqual(
      {
        tracks: [
          {
            id: 1,
            display: 'Requirement Phase'
          },
          {
            id: 2,
            $removed: true
          }
        ],
        partners: [
          { id: '12', name: 'john' }
        ]
      }
    );

    const obj = _.cloneDeep(originalObject);
    const syncedObj = syncHelper.mergeChanges(obj, change);
    // but syncedObj would not have description since it was null
    delete updatedObject.tracks[0].description;
    expect(syncedObj).toEqual(updatedObject);
  });

  it('should throw an error when the merged object property is not an array and the corresponding change is', function() {
    const objectToBeUpdated = {
      name: 'Minolo',
      roles: [],
      tracks: [
        {
          id: 1,
          display: 'Requirement'
        },
        {
          id: 2,
          display: 'Implementation'
        }
      ],
      partners: 10,
      revision: 1
    };

    const change =
      {
        tracks: [
          {
            id: 1,
            display: 'Requirement Phase'
          },
          {
            id: 2,
            $removed: true
          }
        ],
      // the change is passing an array instead
        partners: [
        { id: '12', name: 'john' }
        ]
      };

    try {
      syncHelper.mergeChanges(objectToBeUpdated, change);
      fail('Should have thrown an exception');
    } catch (err) {
      expect(err.message).toBe('Property partners in the change object is an array but merged object property has a different type.');
    }
  });

  it('get deep array differences', function() {
    const originalObject = {
      name: 'Minolo',
      tracks: [
        {
          id: 1,
          display: 'Requirement',
          resources: [
            { id: 1, name: 'pedro' },
            { id: 2, name: 'pablo' },
            { id: 3, name: 'john' }
          ],
          assets: ['software', 'computers']
        },
        {
          id: 2,
          display: 'Implementation',
          resources: [
            { id: 1, name: 'thomas' }
          ]
        }
      ],
      revision: 1
    };

    const updatedObject = _.cloneDeep(originalObject);
    updatedObject.tracks[0].resources = [
      // peter is updated
      { id: 1, name: 'peter' },
      // pablo is removed
      { id: 3, name: 'john' },
      { id: 4, name: 'philip', comment: null }
    ];
    // all resources removed
    updatedObject.tracks[1].resources = [];
    updatedObject.tracks[0].assets = [];

    const change = syncHelper.differenceBetween(updatedObject, originalObject);

    // console.info(JSON.stringify(change, null, 2));
    expect(change).toEqual(
      {
        tracks: [
          {
            id: 1,
            resources: [
              {
                id: 1,
                name: 'peter'
              },
              {
                id: 4,
                name: 'philip'
              },
              {
                id: 2,
                $removed: true
              }
            ],
            assets: [],
          },
          {
            id: 2,
            resources: []
          }
        ]
      }
    );
    const obj = _.cloneDeep(originalObject);
    const syncedObj = syncHelper.mergeChanges(obj, change);
    // but syncedObj would not have comment since it was null
    delete updatedObject.tracks[0].resources[2].comment;
    expect(syncedObj).toEqual(updatedObject);
  });
});

