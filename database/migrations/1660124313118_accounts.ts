import BaseAergiaSchema from 'Database/BaseAergiaSchema';

export default class extends BaseAergiaSchema {
    public async up () {
        this.schema.createTable (this.getTableName (), (table) => {
            table.increments ('account_id').primary ();

            table.integer ('user_id').unsigned ();
            table.string ('account_name');

            table.foreign ('user_id').references ('user_id').inTable('users');
        });
        await super.up();
    }

    protected getTableName (): string {
        return 'accounts';
    }
}
