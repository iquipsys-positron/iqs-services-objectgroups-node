import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class ObjectGroupsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/object_groups');
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-objectgroups', 'controller', 'default', '*', '1.0'));
    }
}