import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default abstract class BaseAergiaSchema extends BaseSchema {

    public async up () {
        this.schema.alterTable(this.getTableName(), (table) => {
            table.string ('creation_user');
            table.timestamp ('creation_date', { useTz: true });
            table.string ('update_user');
            table.timestamp ('update_date', { useTz: true });
        })
    }

    public async down () {
        this.schema.dropTable (this.getTableName());
    }

    protected abstract getTableName (): string;
}