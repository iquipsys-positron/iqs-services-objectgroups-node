let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { ObjectGroupV1 } from '../../src/data/version1/ObjectGroupV1';
import { ObjectGroupsMemoryPersistence } from '../../src/persistence/ObjectGroupsMemoryPersistence';
import { ObjectGroupsController } from '../../src/logic/ObjectGroupsController';
import { ObjectGroupsLambdaFunction } from '../../src/container/ObjectGroupsLambdaFunction';

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

suite('ObjectGroupsLambdaFunction', ()=> {
    let lambda: ObjectGroupsLambdaFunction;

    suiteSetup((done) => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'iqs-services-objectgroups:persistence:memory:default:1.0',
            'controller.descriptor', 'iqs-services-objectgroups:controller:default:default:1.0'
        );

        lambda = new ObjectGroupsLambdaFunction();
        lambda.configure(config);
        lambda.open(null, done);
    });
    
    suiteTeardown((done) => {
        lambda.close(null, done);
    });
    
    test('CRUD Operations', (done) => {
        var group1, group2;

        async.series([
        // Create one group
            (callback) => {
                lambda.act(
                    {
                        role: 'object_groups',
                        cmd: 'create_group',
                        group: GROUP1
                    },
                    (err, group) => {
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
                lambda.act(
                    {
                        role: 'object_groups',
                        cmd: 'create_group',
                        group: GROUP2
                    },
                    (err, group) => {
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
                lambda.act(
                    {
                        role: 'object_groups',
                        cmd: 'get_groups' 
                    },
                    (err, page) => {
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

                lambda.act(
                    {
                        role: 'object_groups',
                        cmd: 'update_group',
                        group: group1
                    },
                    (err, group) => {
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
                lambda.act(
                    {
                        role: 'object_groups',
                        cmd: 'remove_object',
                        group_id: group1.id,
                        object_id: '2'
                    },
                    (err, group) => {
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
                lambda.act(
                    {
                        role: 'object_groups',
                        cmd: 'add_object',
                        group_id: group1.id,
                        object_id: '5'
                    },
                    (err, group) => {
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
                lambda.act(
                    {
                        role: 'object_groups',
                        cmd: 'delete_group_by_id',
                        group_id: group1.id
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete group
            (callback) => {
                lambda.act(
                    {
                        role: 'object_groups',
                        cmd: 'get_group_by_id',
                        group_id: group1.id
                    },
                    (err, group) => {
                        assert.isNull(err);

                        assert.isNotNull(group);
                        assert.isTrue(group.deleted);

                        callback();
                    }
                );
            }
        ], done);
    });
});