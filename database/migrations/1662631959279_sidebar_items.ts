import BaseAergiaSchema from 'Database/BaseAergiaSchema';

export default class extends BaseAergiaSchema {
    public async up () {
        this.schema.createTable (this.getTableName (), (table) => {
            table.increments ('sidebar_item_id');
            table.integer ('group_id').unsigned ();
            table.string ('type').notNullable ();
            table.string ('text').notNullable ();
            table.string ('icon').nullable ();
            table.string ('link').nullable ();
            table.string ('color').nullable ();
            table.string ('badge').nullable ();
            table.boolean ('active').defaultTo (false);

            table.foreign ('group_id').references ('group_id').inTable ('groups');
        });
        super.up ();
    }

    public async down () {
        this.schema.dropTable (this.getTableName ());
    }

    protected getTableName (): string {
        return 'sidebar_items';
    }
}
