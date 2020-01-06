"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const ObjectGroupsCommandSet_1 = require("./ObjectGroupsCommandSet");
const ControlObjectsConnector_1 = require("./ControlObjectsConnector");
const ZonesConnector_1 = require("./ZonesConnector");
const EventRulesConnector_1 = require("./EventRulesConnector");
class ObjectGroupsController {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(ObjectGroupsController._defaultConfig);
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
        // this._objectsClient = this._dependencyResolver.getOneOptional<IControlObjectsClientV1>('control-objects');
        this._objectsConnector = new ControlObjectsConnector_1.ControlObjectsConnector(null); //this._objectsClient);
        this._zonesClient = this._dependencyResolver.getOneOptional('zones');
        this._zonesConnector = new ZonesConnector_1.ZonesConnector(this._zonesClient);
        this._eventRulesClient = this._dependencyResolver.getOneOptional('event-rules');
        this._eventRulesConnector = new EventRulesConnector_1.EventRulesConnector(this._eventRulesClient);
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new ObjectGroupsCommandSet_1.ObjectGroupsCommandSet(this);
        return this._commandSet;
    }
    getGroups(correlationId, filter, paging, callback) {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    getGroupById(correlationId, id, callback) {
        this._persistence.getOneById(correlationId, id, callback);
    }
    createGroup(correlationId, group, callback) {
        let newGroup;
        async.series([
            (callback) => {
                this._persistence.create(correlationId, group, (err, data) => {
                    newGroup = data;
                    callback(err);
                });
            },
            (callback) => {
                this._objectsConnector.addObjects(correlationId, newGroup, callback);
            }
        ], (err) => {
            callback(err, err == null ? newGroup : null);
        });
    }
    updateGroup(correlationId, group, callback) {
        let oldGroup;
        let newGroup;
        async.series([
            (callback) => {
                this._persistence.getOneById(correlationId, group.id, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services3_commons_node_3.NotFoundException(correlationId, 'GROUP_NOT_FOUND', 'Object group ' + group.id + ' was not found').withDetails('group_id', group.id);
                    }
                    oldGroup = data;
                    callback(err);
                });
            },
            (callback) => {
                this._persistence.update(correlationId, group, (err, data) => {
                    newGroup = data;
                    callback(err);
                });
            },
            (callback) => {
                this._objectsConnector.updateObjects(correlationId, oldGroup, newGroup, callback);
            }
        ], (err) => {
            callback(err, err == null ? newGroup : null);
        });
    }
    deleteGroupById(correlationId, id, callback) {
        let oldGroup;
        let newGroup;
        async.series([
            // Get object
            (callback) => {
                this._persistence.getOneById(correlationId, id, (err, data) => {
                    oldGroup = data;
                    callback(err);
                });
            },
            // Set logical deletion flag
            (callback) => {
                if (oldGroup == null) {
                    callback();
                    return;
                }
                newGroup = _.clone(oldGroup);
                newGroup.deleted = true;
                newGroup.object_ids = [];
                this._persistence.update(correlationId, newGroup, (err, data) => {
                    newGroup = data;
                    callback(err);
                });
            },
            // Remove from all objects
            (callback) => {
                if (oldGroup)
                    this._objectsConnector.removeObjects(correlationId, oldGroup, callback);
                else
                    callback();
            },
            // Remove from all zones
            (callback) => {
                if (oldGroup)
                    this._zonesConnector.unsetObject(correlationId, oldGroup, callback);
                else
                    callback();
            },
            // Remove from all rules
            (callback) => {
                if (oldGroup)
                    this._eventRulesConnector.unsetObject(correlationId, oldGroup, callback);
                else
                    callback();
            }
        ], (err) => {
            callback(err, err == null ? oldGroup : null);
        });
    }
    addObject(correlationId, group_id, object_id, callback) {
        let oldGroup;
        let newGroup;
        async.series([
            (callback) => {
                this._persistence.getOneById(correlationId, group_id, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services3_commons_node_3.NotFoundException(correlationId, 'GROUP_NOT_FOUND', 'Object group ' + group_id + ' was not found').withDetails('group_id', group_id);
                    }
                    oldGroup = data;
                    callback(err);
                });
            },
            (callback) => {
                oldGroup.object_ids = _.filter(oldGroup.object_ids, (id) => id != object_id);
                oldGroup.object_ids.push(object_id);
                callback();
            },
            (callback) => {
                this._persistence.update(correlationId, oldGroup, (err, data) => {
                    newGroup = data;
                    callback(err);
                });
            }
        ], (err) => {
            callback(err, err == null ? newGroup : null);
        });
    }
    removeObject(correlationId, group_id, object_id, callback) {
        let oldGroup;
        let newGroup;
        async.series([
            (callback) => {
                this._persistence.getOneById(correlationId, group_id, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services3_commons_node_3.NotFoundException(correlationId, 'GROUP_NOT_FOUND', 'Object group ' + group_id + ' was not found').withDetails('group_id', group_id);
                    }
                    oldGroup = data;
                    callback(err);
                });
            },
            (callback) => {
                oldGroup.object_ids = _.filter(oldGroup.object_ids, (id) => id != object_id);
                callback();
            },
            (callback) => {
                this._persistence.update(correlationId, oldGroup, (err, data) => {
                    newGroup = data;
                    callback(err);
                });
            }
        ], (err) => {
            callback(err, err == null ? newGroup : null);
        });
    }
}
exports.ObjectGroupsController = ObjectGroupsController;
ObjectGroupsController._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'iqs-services-objectgroups:persistence:*:*:1.0', 'dependencies.control-objects', 'iqs-services-controlobjects:client:*:*:1.0', 'dependencies.zones', 'iqs-services-zones:client:*:*:1.0', 'dependencies.event-rules', 'iqs-services-eventrules:client:*:*:1.0');
//# sourceMappingURL=ObjectGroupsController.js.map