import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CountryReligions extends BaseSchema {
    protected tableName = 'country_religions'

    public async up () {
        this.schema.createTable (this.tableName, (table) => {
            table.increments ('id');
            table.integer ('country_id');
            table.integer ('religion_id');
            table.integer ('user_id');

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp ('created_at', {useTz: true})
            table.timestamp ('updated_at', {useTz: true})

            table.primary(['id', 'country_id', 'religion_id', 'user_id']);
            table.foreign(['country_id', 'user_id']).references(['id', 'user_id']).inTable('countries');
            table.foreign(['religion_id', 'user_id']).references(['id', 'user_id']).inTable('religions');
        })
    }

    public async down () {
        this.schema.dropTable (this.tableName)
    }
}
