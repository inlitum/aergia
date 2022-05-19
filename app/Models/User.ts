import { DateTime }                                                              from 'luxon';
import { BaseModel, column, computed, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import Account                                                                   from 'App/Models/Account';
import Transaction                                                               from 'App/Models/Transaction';
import Group                                                                     from 'App/Models/Group';
import { hasGroup }                                                              from 'App/Shared/shared';

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

    @computed ()
    public get isAdmin () {
        return hasGroup (this.userGroups, ['admin_read', 'admin_write']);
    }
}
