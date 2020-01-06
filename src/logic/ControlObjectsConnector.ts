let _ = require('lodash');
let async = require('async');

import { IControlObjectsClientV1 } from 'iqs-clients-controlobjects-node';

import { ObjectGroupV1 } from '../data/version1/ObjectGroupV1';

export class ControlObjectsConnector {

    public constructor(
        private _objectsClient: IControlObjectsClientV1
    ) {}

    public addObjects(correlationId: string, group: ObjectGroupV1,
        callback: (err: any) => void) : void {
        
        if (this._objectsClient == null || group == null) {
            callback(null);
            return;
        }

        async.each(group.object_ids, (objectId, callback) => {
            this._objectsClient.addGroup(correlationId, objectId, group.id, callback);
        }, callback);
    }

    public updateObjects(correlationId: string, oldGroup: ObjectGroupV1,
        newGroup: ObjectGroupV1, callback: (err: any) => void) : void {
        
        if (this._objectsClient == null || oldGroup == null || newGroup == null) {
            callback(null);
            return;
        }

        let removeIds = _.difference(oldGroup.object_ids, newGroup.object_ids);
        let addIds = _.difference(newGroup.object_ids, oldGroup.object_ids);

        async.parallel([
            (callback) => {
                async.each(removeIds, (objectId, callback) => {
                    this._objectsClient.removeGroup(correlationId, objectId, oldGroup.id, callback);
                }, callback);
            },
            (callback) => {
                async.each(addIds, (objectId, callback) => {
                    this._objectsClient.addGroup(correlationId, objectId, oldGroup.id, callback);
                }, callback);
            }
        ], callback);
    }

    public removeObjects(correlationId: string, group: ObjectGroupV1,
        callback: (err: any) => void) : void {
        
        if (this._objectsClient == null || group == null) {
            callback(null);
            return;
        }

        async.each(group.object_ids, (objectId, callback) => {
            this._objectsClient.removeGroup(correlationId, objectId, group.id, callback);
        }, callback);
    }

}