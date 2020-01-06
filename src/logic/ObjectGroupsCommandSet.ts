import { CommandSet } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { Schema } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';

import { ObjectGroupV1 } from '../data/version1/ObjectGroupV1';
import { ObjectGroupV1Schema } from '../data/version1/ObjectGroupV1Schema';
import { IObjectGroupsController } from './IObjectGroupsController';

export class ObjectGroupsCommandSet extends CommandSet {
    private _logic: IObjectGroupsController;

    constructor(logic: IObjectGroupsController) {
        super();

        this._logic = logic;

        // Register commands to the database
		this.addCommand(this.makeGetGroupsCommand());
		this.addCommand(this.makeGetGroupByIdCommand());
		this.addCommand(this.makeCreateGroupCommand());
		this.addCommand(this.makeUpdateGroupCommand());
		this.addCommand(this.makeDeleteGroupByIdCommand());
		this.addCommand(this.makeAddObjectCommand());
		this.addCommand(this.makeRemoveObjectCommand());
    }

	private makeGetGroupsCommand(): ICommand {
		return new Command(
			"get_groups",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                this._logic.getGroups(correlationId, filter, paging, callback);
            }
		);
	}

	private makeGetGroupByIdCommand(): ICommand {
		return new Command(
			"get_group_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('group_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let group_id = args.getAsString("group_id");
                this._logic.getGroupById(correlationId, group_id, callback);
            }
		);
	}

	private makeCreateGroupCommand(): ICommand {
		return new Command(
			"create_group",
			new ObjectSchema(true)
				.withRequiredProperty('group', new ObjectGroupV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let group = args.get("group");
                this._logic.createGroup(correlationId, group, callback);
            }
		);
	}

	private makeUpdateGroupCommand(): ICommand {
		return new Command(
			"update_group",
			new ObjectSchema(true)
				.withRequiredProperty('group', new ObjectGroupV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let group = args.get("group");
                this._logic.updateGroup(correlationId, group, callback);
            }
		);
	}
	
	private makeDeleteGroupByIdCommand(): ICommand {
		return new Command(
			"delete_group_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('group_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let groupId = args.getAsNullableString("group_id");
                this._logic.deleteGroupById(correlationId, groupId, callback);
			}
		);
	}

	private makeAddObjectCommand(): ICommand {
		return new Command(
			"add_object",
			new ObjectSchema(true)
				.withRequiredProperty('group_id', TypeCode.String)
				.withRequiredProperty('object_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let groupId = args.getAsNullableString("group_id");
                let objectId = args.getAsNullableString("object_id");
                this._logic.addObject(correlationId, groupId, objectId, callback);
			}
		);
	}

	private makeRemoveObjectCommand(): ICommand {
		return new Command(
			"remove_object",
			new ObjectSchema(true)
				.withRequiredProperty('group_id', TypeCode.String)
				.withRequiredProperty('object_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let groupId = args.getAsNullableString("group_id");
                let objectId = args.getAsNullableString("object_id");
                this._logic.removeObject(correlationId, groupId, objectId, callback);
			}
		);
	}

}