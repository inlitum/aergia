import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Users extends BaseSchema {
    protected tableName = 'users';

    public async up () {
        this.schema.createTable (this.tableName, (table) => {
            table.increments ('id');
            // Account Login stuff
            table.string ('email', 255).notNullable ();
            table.string ('password', 180).notNullable ();
            table.string ('remember_me_token').nullable ();
            // Personalization stuff
            table.string ('username');
            table.integer('level');
            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp ('created_at', { useTz: true });
            table.timestamp ('updated_at', { useTz: true });
        });
    }

    public async down () {
        this.schema.dropTable (this.tableName);
    }
}
