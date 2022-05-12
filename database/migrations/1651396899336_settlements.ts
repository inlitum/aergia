import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Settlements extends BaseSchema {
    protected tableName = 'settlements'

    public async up () {
        this.schema.withSchema('hera').createTable (this.tableName, (table) => {
            table.increments ('id');
            table.integer ('user_id').unsigned ().references ('id').inTable ('public.users');
            table.integer ('district_id').unsigned ();
            table.string ('entity_id', 16).unique ();

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp ('created_at', {useTz: true})
            table.timestamp ('updated_at', {useTz: true})

            table.primary (['id', 'user_id']);
            table.foreign (['district_id', 'user_id']).references (['id', 'user_id']).inTable ('hera.districts');
        })
    }

    public async down () {
        this.schema.dropTable (this.tableName)
    }
}
