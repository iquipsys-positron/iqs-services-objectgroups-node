import { CommandSet } from 'pip-services3-commons-node';
import { IObjectGroupsController } from './IObjectGroupsController';
export declare class ObjectGroupsCommandSet extends CommandSet {
    private _logic;
    constructor(logic: IObjectGroupsController);
    private makeGetGroupsCommand;
    private makeGetGroupByIdCommand;
    private makeCreateGroupCommand;
    private makeUpdateGroupCommand;
    private makeDeleteGroupByIdCommand;
    private makeAddObjectCommand;
    private makeRemoveObjectCommand;
}
