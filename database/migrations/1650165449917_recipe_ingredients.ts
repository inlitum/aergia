import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RecipeIngredients extends BaseSchema {
  protected tableName = 'recipe_ingredients'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('recipe_id').unsigned()
      table.integer('ingredient_id').unsigned()
      table.integer('user_id').unsigned().references('id').inTable('users')

      table.string('measurement')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.primary(['recipe_id', 'ingredient_id'])

      table
        .foreign(['ingredient_id', 'user_id'])
        .references(['id', 'user_id'])
        .inTable('ingredients')

      table.foreign(['recipe_id', 'user_id']).references(['id', 'user_id']).inTable('recipes')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
