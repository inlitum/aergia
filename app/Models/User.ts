import { DateTime }                                                    from 'luxon';
import { BaseModel, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import Account                                                         from 'App/Models/Account';
import Transaction                                            from 'App/Models/Transaction';

export default class User extends BaseModel {
    @column ({ isPrimary: true })
    public id: number;

    @column ()
    public username: string;

    @column ()
    public email: string;

    @column()
    public password: string;

    @column()
    public rememberMeToken: string;

    @manyToMany (() => Account, {
        pivotTable: 'user_accounts'
    })
    public accounts: ManyToMany<typeof Account>;

    @hasMany(() => Transaction, {    })
    public transactions: HasMany<typeof Transaction>;

    @column.dateTime ({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime ({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;
}
