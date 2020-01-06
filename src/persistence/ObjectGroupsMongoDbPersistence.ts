let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { TagsProcessor } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { ObjectGroupV1 } from '../data/version1/ObjectGroupV1';
import { IObjectGroupsPersistence } from './IObjectGroupsPersistence';

export class ObjectGroupsMongoDbPersistence extends IdentifiableMongoDbPersistence<ObjectGroupV1, string> implements IObjectGroupsPersistence {

    constructor() {
        super('object_groups');
        super.ensureIndex({ org_id: 1 });
        this._maxPageSize = 1000;
    }
    
    private composeFilter(filter: any) {
        filter = filter || new FilterParams();

        let criteria = [];

        let search = filter.getAsNullableString('search');
        if (search != null) {
            let searchRegex = new RegExp(search, "i");
            let searchCriteria = [];
            searchCriteria.push({ name: { $regex: searchRegex } });
            criteria.push({ $or: searchCriteria });
        }

        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });

        let org_id = filter.getAsNullableString('org_id');
        if (org_id != null)
            criteria.push({ org_id: org_id });

        // Filter ids
        let ids = filter.getAsObject('ids');
        if (_.isString(ids))
            ids = ids.split(',');
        if (_.isArray(ids))
            criteria.push({ _id: { $in: ids } });

        // Filter except ids
        let exceptIds = filter.getAsObject('except_ids');
        if (_.isString(exceptIds))
            exceptIds = exceptIds.split(',');
        if (_.isArray(exceptIds))
            criteria.push({ _id: { $nin: exceptIds } });

        let deleted = filter.getAsBooleanWithDefault('deleted', false);
        if (!deleted)
            criteria.push({ $or: [ { deleted: false }, { deleted: { $exists: false } } ] });

        return criteria.length > 0 ? { $and: criteria } : null;
    }
    
    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<ObjectGroupV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

}
