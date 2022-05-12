import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Transactions extends BaseSchema {
    protected tableName = 'transactions';

    public async up () {
        this.schema.createTable (this.tableName, (table) => {
            table.increments ('id');
            table.integer ('user_id').unsigned().references('users.id');

            table.string ('reason');
            table.float ('amount');
            table.boolean ('deposit');
            table.integer ('account_id').unsigned();

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp ('created_at', { useTz: true });
            table.timestamp ('updated_at', { useTz: true });

            table.primary(['id', 'user_id'])
            table.foreign(['account_id', 'user_id']).references(['id', 'user_id']).inTable('accounts')
        });
    }

    public async down () {
        this.schema.dropTable (this.tableName);
    }
}
