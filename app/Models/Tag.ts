import { column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import BaseAergiaModel                    from 'App/Models/BaseAergiaModel';
import User            from 'App/Models/User';

export default class Tag extends BaseAergiaModel {
    @column({ isPrimary: true })
    public tagId: number;

    @column()
    public tagName: string;

    @column()
    public accountName: string;

    @manyToMany(() => User, {
        pivotTable: 'user_tags',
        localKey  : 'tagId',
        pivotForeignKey: 'tag_id',
        relatedKey: 'id',
        pivotRelatedForeignKey: 'user_id'
    })
    public users: ManyToMany<typeof User>
}
