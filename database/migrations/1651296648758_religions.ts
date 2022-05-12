import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Religions extends BaseSchema {
    protected tableName = 'religions'

    public async up () {
        this.schema.withSchema('hera').withSchema('hera').createTable (this.tableName, (table) => {
            table.increments('id');
            table.integer('user_id').unsigned().references('id').inTable('public.users');
            table.string('entity_id', 16).unique();

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp ('created_at', {useTz: true})
            table.timestamp ('updated_at', {useTz: true})

            table.primary(['id', 'user_id']);
        })
    }

    public async down () {
        this.schema.dropTable (this.tableName)
    }
}
