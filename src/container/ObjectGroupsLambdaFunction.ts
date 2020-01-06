import { Descriptor } from 'pip-services3-commons-node';
import { CommandableLambdaFunction } from 'pip-services3-aws-node';
import { ObjectGroupsServiceFactory } from '../build/ObjectGroupsServiceFactory';

export class ObjectGroupsLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("object_groups", "Object groups function");
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-objectgroups', 'controller', 'default', '*', '*'));
        this._factories.add(new ObjectGroupsServiceFactory());
    }
}

export const handler = new ObjectGroupsLambdaFunction().getHandler();