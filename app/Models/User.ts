import { DateTime }                                                              from 'luxon';
import { BaseModel, column, computed, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import Account                                                                   from 'App/Models/Account';
import Transaction                                                               from 'App/Models/Transaction';
import Group                                                                     from 'App/Models/Group';

export default class User extends BaseModel {
    @column ({ isPrimary: true, columnName: 'user_id' })
    public id: number;

    @column ()
    public username: string;

    @column ()
    public email: string;

    @column ({ serializeAs: null })
    public password: string;

    @column ()
    public rememberMeToken: string;

    @manyToMany (() => Group, {
        pivotTable:               'user_groups'
        , localKey:               'id'
        , pivotForeignKey:        'user_id'
        , relatedKey:             'id'
        , pivotRelatedForeignKey: 'group_id',
        pivotTimestamps:          true,
        serializeAs:              null,
    })
    public userGroups: ManyToMany<typeof Group>;

    @manyToMany (() => Account, {
        pivotTable: 'user_accounts',
    })
    public accounts: ManyToMany<typeof Account>;

    @hasMany (() => Transaction, {})
    public transactions: HasMany<typeof Transaction>;

    @column.dateTime ({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime ({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;

    @computed ({
        serializeAs: 'userGroups',
    })
    public get generatedUserGroups (): string[] {
        if (!this.userGroups) {
            return [];
        }

        return this.userGroups.map (group => {
            return group.name;
        });
    }

    public async hasAdminRead (): Promise<boolean> {
        return await this.hasGroups (['admin_read', 'admin_write']);
    }

    public async hasAdminWrite (): Promise<boolean> {
        return await this.hasGroup ('admin_write');
    }

    public async hasGroup (group: string): Promise<boolean> {
        if (!this.userGroups) {
            return false;
        }
        for (let i = 0; i < this.userGroups.length; i++) {
            if (this.userGroups[ i ].name === group) {
                return true;
            }
        }
        return false;
    }

    public async hasGroups (groups: string[]): Promise<boolean> {
        for (let i = 0; i < groups.length; i++) {
            if (await this.hasGroup (groups[ i ])) {
                return true;
            }
        }
        return false;
    }
}
