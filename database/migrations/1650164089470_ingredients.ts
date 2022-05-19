import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Ingredients extends BaseSchema {
  protected tableName = 'ingredients'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('name')
      table.float('protein')
      table.float('calories')
      table.float('fat')
      table.float('carbs')
      table.float('sodium')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.primary(['id', 'user_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
