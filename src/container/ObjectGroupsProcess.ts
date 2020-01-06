import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';

import { ObjectGroupsServiceFactory } from '../build/ObjectGroupsServiceFactory';
// import { ControlObjectsClientFactory } from 'iqs-clients-controlobjects-node';
import { ZonesClientFactory } from 'iqs-clients-zones-node';
import { EventRulesClientFactory } from 'iqs-clients-eventrules-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

export class ObjectGroupsProcess extends ProcessContainer {

    public constructor() {
        super("groups", "Object groups microservice");
        this._factories.add(new ObjectGroupsServiceFactory);
        // this._factories.add(new ControlObjectsClientFactory);
        this._factories.add(new ZonesClientFactory);
        this._factories.add(new EventRulesClientFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
