import BaseAergiaSchema from 'Database/BaseAergiaSchema';

export default class Users extends BaseAergiaSchema {
    public async up () {
        this.schema.createTable( this.getTableName(), ( table ) => {
            table.increments( 'user_id' ).primary();
            // Account Login stuff
            table.string( 'email' ).notNullable();
            table.string( 'password' ).notNullable();
            table.string( 'remember_me_token' ).nullable();
            // Personalization stuff
            table.string( 'username' ).notNullable();
        } );
        await super.up();
    }

    protected getTableName (): string {
        return 'users';
    }
}
