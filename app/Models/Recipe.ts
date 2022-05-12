import {DateTime} from 'luxon'
import {BaseModel, column, ManyToMany, manyToMany} from '@ioc:Adonis/Lucid/Orm'
import Ingredient from "App/Models/Ingredient";

export default class Recipe extends BaseModel {
    @column ({isPrimary: true})
    public id: number

    @column()
    public userId: number;

    @column()
    public name: string;

    @column()
    public steps: string;

    @manyToMany(() => Ingredient, {
        pivotTable: 'recipe_ingredients'
        , localKey: 'id'
        , pivotForeignKey: 'recipe_id'
        , pivotColumns: ['measurements']
    })
    public ingredients: ManyToMany<typeof Ingredient>

    @column.dateTime ({autoCreate: true})
    public createdAt: DateTime

    @column.dateTime ({autoCreate: true, autoUpdate: true})
    public updatedAt: DateTime
}
