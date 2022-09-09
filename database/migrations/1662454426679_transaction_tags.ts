import BaseAergiaSchema from 'Database/BaseAergiaSchema';

export default class extends BaseAergiaSchema {

    public async up () {
        this.schema.createTable (this.getTableName (), (table) => {
            table.integer ('transaction_id').unsigned();
            table.integer ('tag_id').unsigned();

            table.foreign('transaction_id').references('transaction_id').inTable('transactions');
            table.foreign('tag_id').references('tag_id').inTable('tags');

            table.primary(['transaction_id', 'tag_id']);
        });
        await super.up();
    }

    protected getTableName (): string {
        return 'transaction_tags';
    }
}
