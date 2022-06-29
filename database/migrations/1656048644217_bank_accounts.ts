import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BankAccounts extends BaseSchema {
  protected tableName = 'bank_accounts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('bank_account_id');
      table.float('initial_balance');
      table.string('account_name');

      table.integer('user_id').unsigned();

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('users').references('user_id');
      table.primary(['bank_account_id', 'user_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
