import {DateTime} from 'luxon';
import {BaseModel, column, HasMany, hasMany, hasOne} from '@ioc:Adonis/Lucid/Orm';
import {HasOne} from '@adonisjs/lucid/build/src/Factory/Relations/HasOne';
import User from 'App/Models/User';
import Transaction from 'App/Models/Transaction';

export default class Account extends BaseModel {
    @column ({isPrimary: true})
    public id: number;

    @column ()
    public name: string;

    @column ()
    public startingAmount: number;

    @column ()
    public currentAmount: number;

    @column ()
    public userId: number;

    @hasOne (() => User)
    // @ts-ignore
    public user: HasOne<typeof User>;

    @hasMany (() => Transaction)
    public transactions: HasMany<typeof Transaction>;

    @column.dateTime ({autoCreate: true})
    public createdAt: DateTime;

    @column.dateTime ({autoCreate: true, autoUpdate: true})
    public updatedAt: DateTime;

    async addAmount (amount: number, deposit: boolean) {
        if (deposit) {
            this.currentAmount += amount;
        } else {
            this.currentAmount -= amount;
        }

        try {
            await this.save();
            return true;
        } catch {
            return false;
        }
    }
}
