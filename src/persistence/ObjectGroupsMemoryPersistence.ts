let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';

import { ObjectGroupV1 } from '../data/version1/ObjectGroupV1';
import { IObjectGroupsPersistence } from './IObjectGroupsPersistence';

export class ObjectGroupsMemoryPersistence 
    extends IdentifiableMemoryPersistence<ObjectGroupV1, string> 
    implements IObjectGroupsPersistence {

    constructor() {
        super();
        this._maxPageSize = 1000;
    }

    private matchString(value: string, search: string): boolean {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }

    private matchSearch(item: ObjectGroupV1, search: string): boolean {
        search = search.toLowerCase();
        if (this.matchString(item.name, search))
            return true;
        return false;
    }

    private contains(array1, array2) {
        if (array1 == null || array2 == null) return false;
        
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i1]) 
                    return true;
        }
        
        return false;
    }
    
    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        
        let search = filter.getAsNullableString('search');
        let id = filter.getAsNullableString('id');
        let org_id = filter.getAsNullableString('org_id');
        let ids = filter.getAsObject('ids');
        let exceptIds = filter.getAsObject('except_ids');
        let deleted = filter.getAsBooleanWithDefault('deleted', false);
        
        // Process ids filter
        if (_.isString(ids))
            ids = ids.split(',');
        if (!_.isArray(ids))
            ids = null;

        // Process except ids filter
        if (_.isString(exceptIds))
            exceptIds = exceptIds.split(',');
        if (!_.isArray(exceptIds))
            exceptIds = null;
        
        return (item) => {
            if (id && item.id != id) 
                return false;
            if (ids && _.indexOf(ids, item.id) < 0)
                return false;
            if (exceptIds && _.indexOf(exceptIds, item.id) >= 0)
                return false;
            if (org_id && item.org_id != org_id) 
                return false;
            if (!deleted && item.deleted) 
                return false;
            if (search && !this.matchSearch(item, search)) 
                return false;
            return true; 
        };
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<ObjectGroupV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

}
