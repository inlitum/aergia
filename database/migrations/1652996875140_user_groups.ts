import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserGroups extends BaseSchema {
    protected tableName = 'user_groups'

    public async up () {
        this.schema.createTable (this.tableName, (table) => {
            table.integer ('user_id').unsigned ();
            table.integer ('group_id').unsigned ();

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp ('created_at', { useTz: true })
            table.timestamp ('updated_at', { useTz: true })

            table.primary (['user_id', 'group_id']);
            table.foreign ('user_id').references ('user_id').inTable ('users');
            table.foreign ('group_id').references ('group_id').inTable ('groups');
        })
    }

    public async down () {
        this.schema.dropTable (this.tableName)
    }
}
