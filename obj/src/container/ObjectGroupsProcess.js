"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const ObjectGroupsServiceFactory_1 = require("../build/ObjectGroupsServiceFactory");
const iqs_clients_controlobjects_node_1 = require("iqs-clients-controlobjects-node");
const iqs_clients_zones_node_1 = require("iqs-clients-zones-node");
const iqs_clients_eventrules_node_1 = require("iqs-clients-eventrules-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class ObjectGroupsProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("groups", "Object groups microservice");
        this._factories.add(new ObjectGroupsServiceFactory_1.ObjectGroupsServiceFactory);
        this._factories.add(new iqs_clients_controlobjects_node_1.ControlObjectsClientFactory);
        this._factories.add(new iqs_clients_zones_node_1.ZonesClientFactory);
        this._factories.add(new iqs_clients_eventrules_node_1.EventRulesClientFactory);
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.ObjectGroupsProcess = ObjectGroupsProcess;
//# sourceMappingURL=ObjectGroupsProcess.js.map