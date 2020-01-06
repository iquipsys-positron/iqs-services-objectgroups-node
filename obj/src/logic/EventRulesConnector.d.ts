import { IEventRulesClientV1 } from 'iqs-clients-eventrules-node';
import { ObjectGroupV1 } from '../data/version1/ObjectGroupV1';
export declare class EventRulesConnector {
    private _eventRulesClient;
    constructor(_eventRulesClient: IEventRulesClientV1);
    unsetObject(correlationId: string, obj: ObjectGroupV1, callback: (err: any) => void): void;
}
