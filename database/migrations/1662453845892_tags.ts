import BaseAergiaSchema from 'Database/BaseAergiaSchema';

export default class extends BaseAergiaSchema {

    public async up () {
        this.schema.createTable (this.getTableName (), (table) => {
            table.increments ('tag_id').primary ();

            table.string ('tag_name');
        });
        await super.up();
    }

    protected getTableName (): string {
        return 'tags';
    }
}
