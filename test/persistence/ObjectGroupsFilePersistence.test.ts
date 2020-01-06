import { ConfigParams } from 'pip-services3-commons-node';

import { ObjectGroupsFilePersistence } from '../../src/persistence/ObjectGroupsFilePersistence';
import { ObjectGroupsPersistenceFixture } from './ObjectGroupsPersistenceFixture';

suite('ObjectGroupsFilePersistence', ()=> {
    let persistence: ObjectGroupsFilePersistence;
    let fixture: ObjectGroupsPersistenceFixture;
    
    setup((done) => {
        persistence = new ObjectGroupsFilePersistence('./data/object_groups.test.json');

        fixture = new ObjectGroupsPersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
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