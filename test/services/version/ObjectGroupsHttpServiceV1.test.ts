let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { ObjectGroupV1 } from '../../../src/data/version1/ObjectGroupV1';
import { ObjectGroupsMemoryPersistence } from '../../../src/persistence/ObjectGroupsMemoryPersistence';
import { ObjectGroupsController } from '../../../src/logic/ObjectGroupsController';
import { ObjectGroupsHttpServiceV1 } from '../../../src/services/version1/ObjectGroupsHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

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

suite('ObjectGroupsHttpServiceV1', ()=> {    
    let service: ObjectGroupsHttpServiceV1;
    let rest: any;

    suiteSetup((done) => {
        let persistence = new ObjectGroupsMemoryPersistence();
        let controller = new ObjectGroupsController();

        service = new ObjectGroupsHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('iqs-services-objectgroups', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('iqs-services-objectgroups', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('iqs-services-objectgroups', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });
    
    
    test('CRUD Operations', (done) => {
        let group1, group2;

        async.series([
        // Create one group
            (callback) => {
                rest.post('/v1/object_groups/create_group',
                    {
                        group: GROUP1
                    },
                    (err, req, res, group) => {
                        assert.isNull(err);

                        assert.isObject(group);
                        assert.equal(group.name, GROUP1.name);
                        assert.equal(group.org_id, GROUP1.org_id);
                        assert.sameMembers(group.object_ids, GROUP1.object_ids);

                        group1 = group;

                        callback();
                    }
                );
            },
        // Create another group
            (callback) => {
                rest.post('/v1/object_groups/create_group', 
                    {
                        group: GROUP2
                    },
                    (err, req, res, group) => {
                        assert.isNull(err);

                        assert.isObject(group);
                        assert.equal(group.name, GROUP2.name);
                        assert.equal(group.org_id, GROUP2.org_id);
                        assert.sameMembers(group.object_ids, GROUP2.object_ids);

                        group2 = group;

                        callback();
                    }
                );
            },
        // Get all groups
            (callback) => {
                rest.post('/v1/object_groups/get_groups',
                    {},
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
        // Update the group
            (callback) => {
                group1.name = 'Updated group 1';

                rest.post('/v1/object_groups/update_group',
                    { 
                        group: group1
                    },
                    (err, req, res, group) => {
                        assert.isNull(err);

                        assert.isObject(group);
                        assert.equal(group.name, 'Updated group 1');
                        assert.equal(group.id, GROUP1.id);

                        group1 = group;

                        callback();
                    }
                );
            },
        // Remove object
            (callback) => {
                rest.post('/v1/object_groups/remove_object',
                    { 
                        group_id: group1.id,
                        object_id: '2'
                    },
                    (err, req, res, group) => {
                        assert.isNull(err);

                        assert.isObject(group);
                        assert.sameMembers(group.object_ids, ['1']);

                        group1 = group;

                        callback();
                    }
                );
            },
        // Add object
            (callback) => {
                rest.post('/v1/object_groups/add_object',
                    { 
                        group_id: group1.id,
                        object_id: '5'
                    },
                    (err, req, res, group) => {
                        assert.isNull(err);

                        assert.isObject(group);
                        assert.sameMembers(group.object_ids, ['1', '5']);

                        group1 = group;

                        callback();
                    }
                );
            },
        // Delete group
            (callback) => {
                rest.post('/v1/object_groups/delete_group_by_id',
                    {
                        group_id: group1.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            },
        // Try to get delete group
            (callback) => {
                rest.post('/v1/object_groups/get_group_by_id',
                    {
                        group_id: group1.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        assert.isNotNull(result);
                        assert.isTrue(result.deleted);

                        callback();
                    }
                );
            }
        ], done);
    });
});