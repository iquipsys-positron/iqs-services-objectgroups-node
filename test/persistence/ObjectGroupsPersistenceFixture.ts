let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { ObjectGroupV1 } from '../../src/data/version1/ObjectGroupV1';

import { IObjectGroupsPersistence } from '../../src/persistence/IObjectGroupsPersistence';

let GROUP1: ObjectGroupV1 = {
    id: '1',
    org_id: '1',
    name: 'Group 1',
    object_ids: ['1', '2'],
};
let GROUP2: ObjectGroupV1 = {
    id: '2',
    org_id: '1',
    name: 'Group 2',
    object_ids: ['2', '3'],
};
let GROUP3: ObjectGroupV1 = {
    id: '3',
    org_id: '2',
    name: 'Group 3',
    object_ids: [],
};

export class ObjectGroupsPersistenceFixture {
    private _persistence: IObjectGroupsPersistence;
    
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private testCreateObjectGroups(done) {
        async.series([
        // Create one group
            (callback) => {
                this._persistence.create(
                    null,
                    GROUP1,
                    (err, group) => {
                        assert.isNull(err);

                        assert.isObject(group);
                        assert.equal(group.name, GROUP1.name);
                        assert.equal(group.org_id, GROUP1.org_id);
                        assert.sameMembers(group.object_ids, GROUP1.object_ids);

                        callback();
                    }
                );
            },
        // Create another group
            (callback) => {
                this._persistence.create(
                    null,
                    GROUP2,
                    (err, group) => {
                        assert.isNull(err);

                        assert.isObject(group);
                        assert.equal(group.name, GROUP2.name);
                        assert.equal(group.org_id, GROUP2.org_id);
                        assert.sameMembers(group.object_ids, GROUP2.object_ids);

                        callback();
                    }
                );
            },
        // Create yet another group
            (callback) => {
                this._persistence.create(
                    null,
                    GROUP3,
                    (err, group) => {
                        assert.isNull(err);

                        assert.isObject(group);
                        assert.equal(group.name, GROUP3.name);
                        assert.equal(group.org_id, GROUP3.org_id);
                        assert.sameMembers(group.object_ids, GROUP3.object_ids);

                        callback();
                    }
                );
            }
        ], done);
    }
                
    public testCrudOperations(done) {
        let group1: ObjectGroupV1;

        async.series([
        // Create items
            (callback) => {
                this.testCreateObjectGroups(callback);
            },
        // Get all groups
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);

                        group1 = page.data[0];

                        callback();
                    }
                );
            },
        // Update the group
            (callback) => {
                group1.name = 'Updated group 1';

                this._persistence.update(
                    null,
                    group1,
                    (err, group) => {
                        assert.isNull(err);

                        assert.isObject(group);
                        assert.equal(group.name, 'Updated group 1');
                        assert.equal(group.id, group1.id);

                        callback();
                    }
                );
            },
        // Delete group
            (callback) => {
                this._persistence.deleteById(
                    null,
                    group1.id,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete group
            (callback) => {
                this._persistence.getOneById(
                    null,
                    group1.id,
                    (err, group) => {
                        assert.isNull(err);

                        assert.isNull(group || null);

                        callback();
                    }
                );
            }
        ], done);
    }

    public testGetWithFilter(done) {
        async.series([
        // Create groups
            (callback) => {
                this.testCreateObjectGroups(callback);
            },
        // Get groups filtered by search
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        search: '1'
                    }),
                    new PagingParams(),
                    (err, groups) => {
                        assert.isNull(err);

                        assert.isObject(groups);
                        assert.lengthOf(groups.data, 1);

                        callback();
                    }
                );
            },
        // Get groups for organization
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        org_id: '1'
                    }),
                    new PagingParams(),
                    (err, groups) => {
                        assert.isNull(err);

                        assert.isObject(groups);
                        assert.lengthOf(groups.data, 2);

                        callback();
                    }
                );
            }
        ], done);
    }

}
