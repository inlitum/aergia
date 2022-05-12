import {DateTime} from 'luxon'
import {BaseModel, column, ManyToMany, manyToMany} from '@ioc:Adonis/Lucid/Orm'
import Recipe from "App/Models/Recipe";

export default class Ingredient extends BaseModel {
    @column ({isPrimary: true})
    public id: number

    @column ()
    public userId: number;

    @column ()
    public name: string;

    @column ()
    public protein: number;

    @column ()
    public calories: number;

    @column ()
    public fat: number;

    @column ()
    public carbs: number;

    @column ()
    public sodium: number;

    @manyToMany(() => Recipe, {
        pivotTable: 'recipe_ingredients'
        , localKey: 'id'
        , pivotForeignKey: 'ingredient_id'
    })
    public recipes: ManyToMany<typeof Recipe>

    @column.dateTime ({autoCreate: true})
    public createdAt: DateTime

    @column.dateTime ({autoCreate: true, autoUpdate: true})
    public updatedAt: DateTime
}
