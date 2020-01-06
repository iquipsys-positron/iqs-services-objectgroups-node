import { IZonesClientV1 } from 'iqs-clients-zones-node';
import { ObjectGroupV1 } from '../data/version1/ObjectGroupV1';
export declare class ZonesConnector {
    private _zonesClient;
    constructor(_zonesClient: IZonesClientV1);
    unsetObject(correlationId: string, obj: ObjectGroupV1, callback: (err: any) => void): void;
}
