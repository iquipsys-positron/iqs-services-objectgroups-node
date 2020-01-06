import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';
import { ObjectGroupV1 } from '../data/version1/ObjectGroupV1';
import { IObjectGroupsPersistence } from './IObjectGroupsPersistence';
export declare class ObjectGroupsMongoDbPersistence extends IdentifiableMongoDbPersistence<ObjectGroupV1, string> implements IObjectGroupsPersistence {
    constructor();
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<ObjectGroupV1>) => void): void;
}
