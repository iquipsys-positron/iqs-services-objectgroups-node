"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const pip_services3_commons_node_8 = require("pip-services3-commons-node");
const ObjectGroupV1Schema_1 = require("../data/version1/ObjectGroupV1Schema");
class ObjectGroupsCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(logic) {
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
    makeGetGroupsCommand() {
        return new pip_services3_commons_node_2.Command("get_groups", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_8.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.getGroups(correlationId, filter, paging, callback);
        });
    }
    makeGetGroupByIdCommand() {
        return new pip_services3_commons_node_2.Command("get_group_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('group_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let group_id = args.getAsString("group_id");
            this._logic.getGroupById(correlationId, group_id, callback);
        });
    }
    makeCreateGroupCommand() {
        return new pip_services3_commons_node_2.Command("create_group", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('group', new ObjectGroupV1Schema_1.ObjectGroupV1Schema()), (correlationId, args, callback) => {
            let group = args.get("group");
            this._logic.createGroup(correlationId, group, callback);
        });
    }
    makeUpdateGroupCommand() {
        return new pip_services3_commons_node_2.Command("update_group", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('group', new ObjectGroupV1Schema_1.ObjectGroupV1Schema()), (correlationId, args, callback) => {
            let group = args.get("group");
            this._logic.updateGroup(correlationId, group, callback);
        });
    }
    makeDeleteGroupByIdCommand() {
        return new pip_services3_commons_node_2.Command("delete_group_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('group_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let groupId = args.getAsNullableString("group_id");
            this._logic.deleteGroupById(correlationId, groupId, callback);
        });
    }
    makeAddObjectCommand() {
        return new pip_services3_commons_node_2.Command("add_object", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('group_id', pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty('object_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let groupId = args.getAsNullableString("group_id");
            let objectId = args.getAsNullableString("object_id");
            this._logic.addObject(correlationId, groupId, objectId, callback);
        });
    }
    makeRemoveObjectCommand() {
        return new pip_services3_commons_node_2.Command("remove_object", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('group_id', pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty('object_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let groupId = args.getAsNullableString("group_id");
            let objectId = args.getAsNullableString("object_id");
            this._logic.removeObject(correlationId, groupId, objectId, callback);
        });
    }
}
exports.ObjectGroupsCommandSet = ObjectGroupsCommandSet;
//# sourceMappingURL=ObjectGroupsCommandSet.js.map