import { IStringIdentifiable } from 'pip-services3-commons-node';
export declare class ObjectGroupV1 implements IStringIdentifiable {
    id: string;
    org_id: string;
    name: string;
    deleted?: boolean;
    object_ids: string[];
}
