import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Groups extends BaseSchema {
    protected tableName = 'groups';

    public async up () {
        this.schema.alterTable (this.tableName, (table) => {
            table.unique (['name']);
        });
    }

    public async down () {
        this.schema.dropTable (this.tableName);
    }
}
