import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class People extends BaseSchema {
    protected tableName = 'people'

    public async up () {
        this.schema.createTable (this.tableName, (table) => {
            table.increments ('id');
            /* Relationships */
            table.integer ('user_id').unsigned ().references ('id').inTable ('public.users');
            table.integer ('home_settlement_id').unsigned ();
            table.integer ('religion_id').unsigned ();
            table.integer ('current_settlement_id').unsigned();
                /**
                 * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
                 */
            /* Data */
            table.string ('birthName', 50);
            table.string ('occupation');
            table.float ('income');
            table.float ('wealth');
            table.integer ('age');
            table.string ('birthDate');

            table.timestamp ('created_at', {useTz: true})
            table.timestamp ('updated_at', {useTz: true})
        })
    }

    public async down () {
        this.schema.dropTable (this.tableName)
    }
}
