import { column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import BaseAergiaModel                    from 'App/Models/BaseAergiaModel';
import Group                              from 'App/Models/Group';

export default class User extends BaseAergiaModel {
    @column( { isPrimary: true, columnName: 'user_id' } )
    public id: number;

    @column()
    public username: string;

    @column()
    public email: string;

    @column( { serializeAs: null } )
    public password: string;

    @column()
    public rememberMeToken: string;

    @manyToMany( () => Group, {
        localKey              : 'id',
        pivotForeignKey       : 'user_id',
        relatedKey            : 'id',
        pivotRelatedForeignKey: 'group_id',
        pivotTable            : 'user_groups',
        pivotColumns          : [ 'read', 'write' ],
    } )
    public groups: ManyToMany<typeof Group>

    public hasAdminRead (): boolean {
        return this.hasAtLeastOneGroup( [ 'admin_read', 'admin_write' ] );
    }

    public hasAdminWrite (): boolean {
        return this.hasGroup( 'admin_write' );
    }

    private getGroup ( groupName: string ): Group | null {
        if ( !this.groups ) {
            return null;
        }
        for ( let i = 0; i < this.groups.length; i++ ) {
            if ( this.groups[i].groupName === groupName ) {
                return this.groups[i];
            }
        }
        return null;
    }

    public hasWriteGroup ( groupName: string ): boolean {
        const group = this.getGroup( groupName );

        if ( !group ) {
            return false;
        }

        return group.$extras.pivot_write;
    }

    public hasReadGroup ( groupName: string ): boolean {
        const group = this.getGroup( groupName );

        if ( !group ) {
            return false;
        }

        return group.$extras.pivot_read;
    }

    public hasGroup ( groupName: string ): boolean {
        if ( groupName.endsWith( '_write' ) ) {
            return this.hasWriteGroup( groupName.replace( '_write', '' ) );
        }

        if ( groupName.endsWith( '_read' ) ) {
            return this.hasWriteGroup( groupName.replace( '_read', '' ) );
        }

        return this.getGroup( groupName ) !== null;
    }

    public hasAtLeastOneGroup ( groups: string[] ): boolean {
        for ( let i = 0; i < groups.length; i++ ) {
            if ( this.hasGroup( groups[i] ) ) {
                return true;
            }
        }

        return false;
    }

    public hasAllGroups ( groups: string[] ): boolean {
        for ( let i = 0; i < groups.length; i++ ) {
            if ( !this.hasGroup( groups[i] ) ) {
                return false;
            }
        }
        return true;
    }
}
