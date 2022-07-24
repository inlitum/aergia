import BaseAergiaSchema from "Database/BaseAergiaSchema";

export default class Groups extends BaseAergiaSchema {
    public async up () {
        this.schema.createTable (this.getTableName(), (table) => {
            table.increments ('group_id');
            table.string ('group_name').unique();
            table.integer ('parent_group_id').unsigned();

            table.foreign("parent_group_id").references("group_id").inTable("groups");
        });
        await super.up();
    }

    protected getTableName(): string {
        return 'groups';
    }
}
