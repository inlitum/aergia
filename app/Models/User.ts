import { column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import BaseAergiaModel                                      from 'App/Models/BaseAergiaModel';
import UserGroup                                            from 'App/Models/UserGroup';
import Account                                              from 'App/Models/Account';
import Tag                                                  from 'App/Models/Tag';

export default class User extends BaseAergiaModel {
    @column ({ isPrimary: true, columnName: 'user_id', serializeAs: 'user_id' })
    public id: number;

    @column ()
    public username: string;

    @column ()
    public email: string;

    @column ({ serializeAs: null })
    public password: string;

    @column ({ serializeAs: null })
    public rememberMeToken: string;

    @hasMany (() => UserGroup)
    public userGroups: HasMany<typeof UserGroup>;

    @hasMany (() => Account)
    public accounts: HasMany<typeof Account>;

    @manyToMany (() => Tag, {
        pivotTable: 'user_tags',
        relatedKey: 'tagId',
        pivotRelatedForeignKey: 'tag_id',
        localKey: 'id',
        pivotForeignKey: 'user_id'
    })
    public tags: ManyToMany<typeof Tag>;

    public hasAdminRead (): boolean {
        return this.hasAtLeastOneGroup ([ 'admin_read', 'admin_write' ]);
    }

    public hasAdminWrite (): boolean {
        return this.hasGroup ('admin_write');
    }

    private getUserGroup (groupName: string): UserGroup | null {
        if (!this.userGroups) {
            return null;
        }
        for (let i = 0; i < this.userGroups.length; i++) {
            if (!this.userGroups[ i ].group) {
                continue;
            }

            if (this.userGroups[ i ].group.groupName === groupName) {
                return this.userGroups[ i ];
            }
        }
        return null;
    }

    public hasWriteGroup (groupName: string): boolean {
        const userGroup = this.getUserGroup (groupName);

        if (!userGroup) {
            return false;
        }

        return userGroup.write;
    }

    public hasReadGroup (groupName: string): boolean {
        const userGroup = this.getUserGroup (groupName);

        if (!userGroup) {
            return false;
        }

        return userGroup.read;
    }

    public hasGroup (groupName: string): boolean {
        if (groupName.endsWith ('_write')) {
            return this.hasWriteGroup (groupName.replace ('_write', ''));
        }

        if (groupName.endsWith ('_read')) {
            return this.hasReadGroup (groupName.replace ('_read', ''));
        }

        return this.getUserGroup (groupName) !== null;
    }

    public hasAtLeastOneGroup (groups: string[]): boolean {
        for (let i = 0; i < groups.length; i++) {
            if (this.hasGroup (groups[ i ])) {
                return true;
            }
        }

        return false;
    }

    public hasAllGroups (groups: string[]): boolean {
        for (let i = 0; i < groups.length; i++) {
            if (!this.hasGroup (groups[ i ])) {
                return false;
            }
        }
        return true;
    }
}
