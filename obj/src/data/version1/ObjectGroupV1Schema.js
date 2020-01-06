"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
class ObjectGroupV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_node_3.TypeCode.String);
        this.withRequiredProperty('org_id', pip_services3_commons_node_3.TypeCode.String);
        this.withRequiredProperty('name', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('deleted', pip_services3_commons_node_3.TypeCode.Boolean);
        this.withRequiredProperty('object_ids', new pip_services3_commons_node_2.ArraySchema(pip_services3_commons_node_3.TypeCode.String));
    }
}
exports.ObjectGroupV1Schema = ObjectGroupV1Schema;
//# sourceMappingURL=ObjectGroupV1Schema.js.map