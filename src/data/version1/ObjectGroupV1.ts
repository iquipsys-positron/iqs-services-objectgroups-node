import { IStringIdentifiable } from 'pip-services3-commons-node';

export class ObjectGroupV1 implements IStringIdentifiable {
    public id: string;
    public org_id: string;
    public name: string;
    public deleted?: boolean;
    public object_ids: string[];
}