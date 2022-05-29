import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class Status extends BaseModel {

    @column ()
    public loggedIn: boolean;

}
