import BaseAergiaSchema from "Database/BaseAergiaSchema";

export default class UserGroups extends BaseAergiaSchema {
    public async up() {
        this.schema.createTable( this.getTableName(), ( table ) => {
            table.integer( 'user_id' ).unsigned();
            table.integer( 'group_id' ).unsigned();
            table.boolean( 'read' ).defaultTo( false );
            table.boolean( 'write' ).defaultTo( false );

            table.primary( [ 'user_id', 'group_id' ] );
            table.foreign( 'user_id' ).references( 'user_id' ).inTable( 'users' );
            table.foreign( 'group_id' ).references( 'group_id' ).inTable( 'groups' );
        } );
        await super.up();
    }

    protected getTableName(): string {
        return "user_groups";
    }
}
