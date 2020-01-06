let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { NotFoundException } from 'pip-services3-commons-node';

// import { IControlObjectsClientV1 } from 'iqs-clients-controlobjects-node';
import { IZonesClientV1 } from 'iqs-clients-zones-node';
import { IEventRulesClientV1 } from 'iqs-clients-eventrules-node';

import { ObjectGroupV1 } from '../data/version1/ObjectGroupV1';
import { IObjectGroupsPersistence } from '../persistence/IObjectGroupsPersistence';
import { IObjectGroupsController } from './IObjectGroupsController';
import { ObjectGroupsCommandSet } from './ObjectGroupsCommandSet';
import { ControlObjectsConnector } from './ControlObjectsConnector';
import { ZonesConnector } from './ZonesConnector';
import { EventRulesConnector } from './EventRulesConnector';

export class ObjectGroupsController implements  IConfigurable, IReferenceable, ICommandable, IObjectGroupsController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'iqs-services-objectgroups:persistence:*:*:1.0',
        'dependencies.control-objects', 'iqs-services-controlobjects:client:*:*:1.0',
        'dependencies.zones', 'iqs-services-zones:client:*:*:1.0',
        'dependencies.event-rules', 'iqs-services-eventrules:client:*:*:1.0'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(ObjectGroupsController._defaultConfig);
    // private _objectsClient: IControlObjectsClientV1;
    private _objectsConnector: ControlObjectsConnector;
    private _zonesClient: IZonesClientV1;
    private _zonesConnector: ZonesConnector;
    private _eventRulesClient: IEventRulesClientV1;
    private _eventRulesConnector: EventRulesConnector;
    private _persistence: IObjectGroupsPersistence;
    private _commandSet: ObjectGroupsCommandSet;

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IObjectGroupsPersistence>('persistence');

        // this._objectsClient = this._dependencyResolver.getOneOptional<IControlObjectsClientV1>('control-objects');
        this._objectsConnector = new ControlObjectsConnector(null); //this._objectsClient);
        this._zonesClient = this._dependencyResolver.getOneOptional<IZonesClientV1>('zones');
        this._zonesConnector = new ZonesConnector(this._zonesClient);
        this._eventRulesClient = this._dependencyResolver.getOneOptional<IEventRulesClientV1>('event-rules');
        this._eventRulesConnector = new EventRulesConnector(this._eventRulesClient);
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new ObjectGroupsCommandSet(this);
        return this._commandSet;
    }
    
    public getGroups(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<ObjectGroupV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public getGroupById(correlationId: string, id: string, 
        callback: (err: any, group: ObjectGroupV1) => void): void {
        this._persistence.getOneById(correlationId, id, callback);        
    }

    public createGroup(correlationId: string, group: ObjectGroupV1, 
        callback: (err: any, group: ObjectGroupV1) => void): void {
        let newGroup: ObjectGroupV1;
        
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

    public updateGroup(correlationId: string, group: ObjectGroupV1, 
        callback: (err: any, group: ObjectGroupV1) => void): void {
        let oldGroup: ObjectGroupV1;
        let newGroup: ObjectGroupV1;

        async.series([
            (callback) => {
                this._persistence.getOneById(correlationId, group.id, (err, data) => {
                    if (err == null && data == null) {
                        err = new NotFoundException(
                            correlationId,
                            'GROUP_NOT_FOUND',
                            'Object group ' + group.id + ' was not found'
                        ).withDetails('group_id', group.id);
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

    public deleteGroupById(correlationId: string, id: string,
        callback: (err: any, group: ObjectGroupV1) => void): void {  
        let oldGroup: ObjectGroupV1;
        let newGroup: ObjectGroupV1;

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
                else callback();
            },
            // Remove from all zones
            (callback) => {
                if (oldGroup)
                    this._zonesConnector.unsetObject(correlationId, oldGroup, callback);
                else callback();
            },
            // Remove from all rules
            (callback) => {
                if (oldGroup)
                    this._eventRulesConnector.unsetObject(correlationId, oldGroup, callback);
                else callback();
            }
        ], (err) => {
            callback(err, err == null ? oldGroup : null);
        });    
    }

    public addObject(correlationId: string, group_id: string, object_id: string, 
        callback: (err: any, group: ObjectGroupV1) => void): void {
        let oldGroup: ObjectGroupV1;
        let newGroup: ObjectGroupV1;

        async.series([
            (callback) => {
                this._persistence.getOneById(correlationId, group_id, (err, data) => {
                    if (err == null && data == null) {
                        err = new NotFoundException(
                            correlationId,
                            'GROUP_NOT_FOUND',
                            'Object group ' + group_id + ' was not found'
                        ).withDetails('group_id', group_id);
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

    public removeObject(correlationId: string, group_id: string, object_id: string, 
        callback: (err: any, group: ObjectGroupV1) => void): void {
        let oldGroup: ObjectGroupV1;
        let newGroup: ObjectGroupV1;

        async.series([
            (callback) => {
                this._persistence.getOneById(correlationId, group_id, (err, data) => {
                    if (err == null && data == null) {
                        err = new NotFoundException(
                            correlationId,
                            'GROUP_NOT_FOUND',
                            'Object group ' + group_id + ' was not found'
                        ).withDetails('group_id', group_id);
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
