import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';
import { ObjectGroupsMemoryPersistence } from './ObjectGroupsMemoryPersistence';
import { ObjectGroupV1 } from '../data/version1/ObjectGroupV1';
export declare class ObjectGroupsFilePersistence extends ObjectGroupsMemoryPersistence {
    protected _persister: JsonFilePersister<ObjectGroupV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
