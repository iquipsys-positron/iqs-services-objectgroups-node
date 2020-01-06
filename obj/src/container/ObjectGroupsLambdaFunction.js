"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_aws_node_1 = require("pip-services3-aws-node");
const ObjectGroupsServiceFactory_1 = require("../build/ObjectGroupsServiceFactory");
class ObjectGroupsLambdaFunction extends pip_services3_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("object_groups", "Object groups function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('iqs-services-objectgroups', 'controller', 'default', '*', '*'));
        this._factories.add(new ObjectGroupsServiceFactory_1.ObjectGroupsServiceFactory());
    }
}
exports.ObjectGroupsLambdaFunction = ObjectGroupsLambdaFunction;
exports.handler = new ObjectGroupsLambdaFunction().getHandler();
//# sourceMappingURL=ObjectGroupsLambdaFunction.js.map