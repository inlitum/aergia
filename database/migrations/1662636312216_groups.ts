import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {

  public async up () {
    this.schema.alterTable('groups', (table) => {
        table.integer('sidebar_weight')
    })
  }
}
