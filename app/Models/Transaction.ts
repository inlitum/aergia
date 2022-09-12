import { column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm';
import BaseAergiaModel            from 'App/Models/BaseAergiaModel';
import Account            from 'App/Models/Account';

export default class Transaction extends BaseAergiaModel {
    @column ({ isPrimary: true })
    public transactionId: number;

    @column()
    public accountId: number;

    @column()
    public description: string;

    @column()
    public amount: number;

    @hasOne(() => Account)
    public account: HasOne<typeof Account>;
}
