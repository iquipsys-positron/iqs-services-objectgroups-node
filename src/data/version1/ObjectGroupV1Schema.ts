import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class ObjectGroupV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withOptionalProperty('id', TypeCode.String);
        this.withRequiredProperty('org_id', TypeCode.String);
        this.withRequiredProperty('name', TypeCode.String);
        this.withOptionalProperty('deleted', TypeCode.Boolean);
        this.withRequiredProperty('object_ids', new ArraySchema(TypeCode.String));
    }
}
