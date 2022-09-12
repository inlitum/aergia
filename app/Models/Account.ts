import { column, computed, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm';
import BaseAergiaModel                                        from 'App/Models/BaseAergiaModel';
import User                                from 'App/Models/User';
import Transaction                         from 'App/Models/Transaction';

export default class Account extends BaseAergiaModel {
    @column({ isPrimary: true })
    public accountId: number

    @column()
    public userId: number;

    @column()
    public accountName: string;

    @hasOne(() => User, {
        localKey  : 'userId',
        foreignKey: 'id',
    })

    public user: HasOne<typeof User>

    @hasMany(() => Transaction, {
        localKey: 'accountId',
        foreignKey: 'accountId'
    })
    public transactions: HasMany<typeof Transaction>;


    @computed({serializeAs: 'balance'})
    public get getBalance() {
        if (!this.transactions || this.transactions.length === 0) {
            return 0;
        }

        let balance = 0;

        for (let transaction of this.transactions) {
            balance += transaction.amount;
        }

        return balance;
    }
}
