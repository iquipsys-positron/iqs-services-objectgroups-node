import { ConfigParams } from 'pip-services3-commons-node';

import { ObjectGroupsMemoryPersistence } from '../../src/persistence/ObjectGroupsMemoryPersistence';
import { ObjectGroupsPersistenceFixture } from './ObjectGroupsPersistenceFixture';

suite('ObjectGroupsMemoryPersistence', ()=> {
    let persistence: ObjectGroupsMemoryPersistence;
    let fixture: ObjectGroupsPersistenceFixture;
    
    setup((done) => {
        persistence = new ObjectGroupsMemoryPersistence();
        persistence.configure(new ConfigParams());
        
        fixture = new ObjectGroupsPersistenceFixture(persistence);
        
        persistence.open(null, done);
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Get with Filters', (done) => {
        fixture.testGetWithFilter(done);
    });

});