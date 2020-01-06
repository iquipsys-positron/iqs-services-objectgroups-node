"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const ObjectGroupsMongoDbPersistence_1 = require("../persistence/ObjectGroupsMongoDbPersistence");
const ObjectGroupsFilePersistence_1 = require("../persistence/ObjectGroupsFilePersistence");
const ObjectGroupsMemoryPersistence_1 = require("../persistence/ObjectGroupsMemoryPersistence");
const ObjectGroupsController_1 = require("../logic/ObjectGroupsController");
const ObjectGroupsHttpServiceV1_1 = require("../services/version1/ObjectGroupsHttpServiceV1");
class ObjectGroupsServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(ObjectGroupsServiceFactory.MemoryPersistenceDescriptor, ObjectGroupsMemoryPersistence_1.ObjectGroupsMemoryPersistence);
        this.registerAsType(ObjectGroupsServiceFactory.FilePersistenceDescriptor, ObjectGroupsFilePersistence_1.ObjectGroupsFilePersistence);
        this.registerAsType(ObjectGroupsServiceFactory.MongoDbPersistenceDescriptor, ObjectGroupsMongoDbPersistence_1.ObjectGroupsMongoDbPersistence);
        this.registerAsType(ObjectGroupsServiceFactory.ControllerDescriptor, ObjectGroupsController_1.ObjectGroupsController);
        this.registerAsType(ObjectGroupsServiceFactory.HttpServiceDescriptor, ObjectGroupsHttpServiceV1_1.ObjectGroupsHttpServiceV1);
    }
}
exports.ObjectGroupsServiceFactory = ObjectGroupsServiceFactory;
ObjectGroupsServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-objectgroups", "factory", "default", "default", "1.0");
ObjectGroupsServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-objectgroups", "persistence", "memory", "*", "1.0");
ObjectGroupsServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-objectgroups", "persistence", "file", "*", "1.0");
ObjectGroupsServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-objectgroups", "persistence", "mongodb", "*", "1.0");
ObjectGroupsServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-objectgroups", "controller", "default", "*", "1.0");
ObjectGroupsServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-objectgroups", "service", "http", "*", "1.0");
//# sourceMappingURL=ObjectGroupsServiceFactory.js.map