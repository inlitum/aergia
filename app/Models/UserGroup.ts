import { column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import BaseAergiaModel            from 'App/Models/BaseAergiaModel';
import User                       from 'App/Models/User';
import Group                      from 'App/Models/Group';

export default class UserGroup extends BaseAergiaModel {
    @column( { isPrimary: true } )
    public userId: number

    @column( { isPrimary: true } )
    public groupId: number

    @column()
    public read: boolean;

    @column()
    public write: boolean;

    @hasOne( () => User, {
        localKey  : 'userId',
        foreignKey: 'id',
    } )
    public user: HasOne<typeof User>

    @hasOne( () => Group, {
        localKey  : 'groupId',
        foreignKey: 'id',
    } )
    public group: HasOne<typeof Group>
}
