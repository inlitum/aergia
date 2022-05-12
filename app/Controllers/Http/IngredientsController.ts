// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Ingredient from "App/Models/Ingredient";

export default class IngredientsController {

    public async index ({auth, request, response}) {

        await auth.authenticate();

        let recipeId = request.params ()[ 'recipe_id' ];

        let page = request.header('page') || 1;
        let perPage = request.header('perPage') || 10;
        let orderBy = request.header('orderBy') || 'name';
        let orderDirection = request.header('orderDirection') || 'asc';

        if (recipeId != null) {
            // TODO Read all ingredients for a given recipe.
            return response.ok();
        }

        return await Ingredient
            .query ()
            .where ('user_id', auth.user.id)
            .orderBy (orderBy, orderDirection)
            .paginate (page, perPage);
    }

    public async show ({ auth, request, response }) {
        await auth.authenticate();

        let ingredientId = request.params()['id'];

        if (ingredientId == null) {
            return response.badRequest();
        }

        let ingredient = await Ingredient
            .query ()
            .where ('id', ingredientId)
            .where ('user_id', auth.user.id)
            .first()

        if (!ingredient) {
            return response.notFound();
        }

        await ingredient.load('recipes');

        return ingredient;
    }

}


