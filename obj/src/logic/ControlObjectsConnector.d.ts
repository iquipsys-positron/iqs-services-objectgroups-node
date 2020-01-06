import { ObjectGroupV1 } from '../data/version1/ObjectGroupV1';
export declare class ControlObjectsConnector {
    private _objectsClient;
    constructor(_objectsClient: object);
    addObjects(correlationId: string, group: ObjectGroupV1, callback: (err: any) => void): void;
    updateObjects(correlationId: string, oldGroup: ObjectGroupV1, newGroup: ObjectGroupV1, callback: (err: any) => void): void;
    removeObjects(correlationId: string, group: ObjectGroupV1, callback: (err: any) => void): void;
}
