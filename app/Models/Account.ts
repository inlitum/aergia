import { column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm';
import BaseAergiaModel            from 'App/Models/BaseAergiaModel';
import User            from 'App/Models/User';

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
}
