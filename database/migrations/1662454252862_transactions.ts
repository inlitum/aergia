import BaseAergiaSchema from 'Database/BaseAergiaSchema';

export default class extends BaseAergiaSchema {

    public async up () {
        this.schema.createTable (this.getTableName (), (table) => {
            table.increments ('transaction_id').primary();
            table.integer ('account_id').unsigned();

            table.string('description');
            table.float('amount');

            table.foreign('account_id').references('account_id').inTable('accounts');
        });
        await super.up();
    }

    protected getTableName (): string {
        return 'transactions';
    }
}
