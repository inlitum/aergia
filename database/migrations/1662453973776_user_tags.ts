import BaseAergiaSchema from 'Database/BaseAergiaSchema';

export default class extends BaseAergiaSchema {

    public async up () {
        this.schema.createTable (this.getTableName (), (table) => {
            table.integer ('tag_id').unsigned();
            table.integer ('user_id').unsigned();

            table.foreign('tag_id').references('tag_id').inTable('tags');
            table.foreign('user_id').references('user_id').inTable('users');

            table.primary(['tag_id', 'user_id']);
        });
        await super.up();
    }

    protected getTableName (): string {
        return 'user_tags';
    }
}
