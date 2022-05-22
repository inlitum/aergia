import { DateTime }                                  from 'luxon';
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import User                                          from 'App/Models/User';

export default class Group extends BaseModel {
    @column ({ isPrimary: true, columnName: 'group_id' })
    public id: number;

    @column ()
    public name: string;

    @manyToMany (() => User, {
        pivotTable:             'user_groups',
        localKey:               'id',
        pivotForeignKey:        'group_id',
        relatedKey:             'id',
        pivotRelatedForeignKey: 'user_id'
    })
    public users: ManyToMany<typeof User>;

    @column.dateTime ({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime ({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;
}
