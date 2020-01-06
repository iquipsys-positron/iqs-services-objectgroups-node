import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IGetter } from 'pip-services3-data-node';
import { IWriter } from 'pip-services3-data-node';
import { ObjectGroupV1 } from '../data/version1/ObjectGroupV1';
export interface IObjectGroupsPersistence extends IGetter<ObjectGroupV1, string>, IWriter<ObjectGroupV1, string> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<ObjectGroupV1>) => void): void;
    getOneById(correlationId: string, id: string, callback: (err: any, item: ObjectGroupV1) => void): void;
    create(correlationId: string, item: ObjectGroupV1, callback: (err: any, item: ObjectGroupV1) => void): void;
    update(correlationId: string, item: ObjectGroupV1, callback: (err: any, item: ObjectGroupV1) => void): void;
    deleteById(correlationId: string, id: string, callback: (err: any, item: ObjectGroupV1) => void): void;
}
