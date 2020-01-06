"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
class ControlObjectsConnector {
    constructor(_objectsClient //IControlObjectsClientV1
    ) {
        this._objectsClient = _objectsClient;
    }
    addObjects(correlationId, group, callback) {
        // if (this._objectsClient == null || group == null) {
        //     callback(null);
        //     return;
        // }
        // async.each(group.object_ids, (objectId, callback) => {
        //     this._objectsClient.addGroup(correlationId, objectId, group.id, callback);
        // }, callback);
        if (callback)
            callback(null);
    }
    updateObjects(correlationId, oldGroup, newGroup, callback) {
        // if (this._objectsClient == null || oldGroup == null || newGroup == null) {
        //     callback(null);
        //     return;
        // }
        // let removeIds = _.difference(oldGroup.object_ids, newGroup.object_ids);
        // let addIds = _.difference(newGroup.object_ids, oldGroup.object_ids);
        // async.parallel([
        //     (callback) => {
        //         async.each(removeIds, (objectId, callback) => {
        //             this._objectsClient.removeGroup(correlationId, objectId, oldGroup.id, callback);
        //         }, callback);
        //     },
        //     (callback) => {
        //         async.each(addIds, (objectId, callback) => {
        //             this._objectsClient.addGroup(correlationId, objectId, oldGroup.id, callback);
        //         }, callback);
        //     }
        // ], callback);
        if (callback)
            callback(null);
    }
    removeObjects(correlationId, group, callback) {
        // if (this._objectsClient == null || group == null) {
        //     callback(null);
        //     return;
        // }
        // async.each(group.object_ids, (objectId, callback) => {
        //     this._objectsClient.removeGroup(correlationId, objectId, group.id, callback);
        // }, callback);
        if (callback)
            callback(null);
    }
}
exports.ControlObjectsConnector = ControlObjectsConnector;
//# sourceMappingURL=ControlObjectsConnector.js.map