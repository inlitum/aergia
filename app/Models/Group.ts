import { column, HasMany, hasMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import UserGroup                                    from 'App/Models/UserGroup';
import BaseAergiaModel                              from 'App/Models/BaseAergiaModel';

export default class Group extends BaseAergiaModel {
    @column( { isPrimary: true, columnName: 'group_id' } )
    public id: number

    @column()
    public groupName: string;

    @column()
    public parentGroupId: number;

    @hasOne( () => Group, {
        foreignKey: 'id',
    } )
    public parentGroup: HasOne<typeof Group>

    @hasMany(() => Group, {
        foreignKey: 'parentGroupId'
    })
    public childGroups: HasMany<typeof Group>;

    @hasMany( () => UserGroup )
    public userGroups: HasMany<typeof UserGroup>

    @column()
    public sidebarWeight: number;
}
