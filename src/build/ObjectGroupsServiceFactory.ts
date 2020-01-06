import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { ObjectGroupsMongoDbPersistence } from '../persistence/ObjectGroupsMongoDbPersistence';
import { ObjectGroupsFilePersistence } from '../persistence/ObjectGroupsFilePersistence';
import { ObjectGroupsMemoryPersistence } from '../persistence/ObjectGroupsMemoryPersistence';
import { ObjectGroupsController } from '../logic/ObjectGroupsController';
import { ObjectGroupsHttpServiceV1 } from '../services/version1/ObjectGroupsHttpServiceV1';

export class ObjectGroupsServiceFactory extends Factory {
	public static Descriptor = new Descriptor("iqs-services-objectgroups", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("iqs-services-objectgroups", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("iqs-services-objectgroups", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("iqs-services-objectgroups", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("iqs-services-objectgroups", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("iqs-services-objectgroups", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(ObjectGroupsServiceFactory.MemoryPersistenceDescriptor, ObjectGroupsMemoryPersistence);
		this.registerAsType(ObjectGroupsServiceFactory.FilePersistenceDescriptor, ObjectGroupsFilePersistence);
		this.registerAsType(ObjectGroupsServiceFactory.MongoDbPersistenceDescriptor, ObjectGroupsMongoDbPersistence);
		this.registerAsType(ObjectGroupsServiceFactory.ControllerDescriptor, ObjectGroupsController);
		this.registerAsType(ObjectGroupsServiceFactory.HttpServiceDescriptor, ObjectGroupsHttpServiceV1);
	}
	
}
