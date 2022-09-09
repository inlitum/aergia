import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';
import { DateTime }          from 'luxon';

export default abstract class BaseAergiaModel extends BaseModel {
    @column()
    public creationUser: string;

    @column.dateTime( { autoCreate: true } )
    public creationDate: DateTime;

    @column()
    public updateUser: string;

    @column.dateTime( { autoUpdate: true } )
    public updateDate: DateTime;
}