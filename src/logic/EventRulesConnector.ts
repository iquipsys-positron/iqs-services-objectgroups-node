let _ = require('lodash');
let async = require('async');

import { IEventRulesClientV1 } from 'iqs-clients-eventrules-node';

import { ObjectGroupV1 } from '../data/version1/ObjectGroupV1';

export class EventRulesConnector {

    public constructor(
        private _eventRulesClient: IEventRulesClientV1
    ) {}

    public unsetObject(correlationId: string, obj: ObjectGroupV1,
        callback: (err: any) => void) : void {
        
        if (this._eventRulesClient == null || obj == null) {
            callback(null);
            return;
        }

        this._eventRulesClient.unsetObject(correlationId, obj.org_id, obj.id, callback);
    }

}