import { DateTime }                          from 'luxon';
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm';
import User                                  from 'App/Models/User';
import Account                               from 'App/Models/Account';

export default class Transaction extends BaseModel {
    @column ({ isPrimary: true })
    public id: number;

    @column()
    public userId: number;

    @column ()
    public reason: string;

    @column()
    public amount: number;

    @column()
    public deposit: boolean;

    @hasOne(() => User)
    public user: HasOne<typeof User>

    @column()
    public accountId: number;

    @hasOne (() => Account)
    public account: HasOne<typeof Account>;

    @column.dateTime ({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime ({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;
}
