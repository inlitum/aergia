// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { DirectoryListing } from "@adonisjs/core/build/standalone";
import BankAccount from "App/Models/BankAccount";

export default class BankAccountsController {

    public async index ({auth, request, response}) {
        let userId = await auth.use('web').user.id;

        if (!userId) {
            return response.unauthorized();
        }

        // Boring old pagination stuff.
        let page           = request.header ('page') || 1;
        let perPage        = request.header ('perPage') || 10;
        let orderBy        = request.header ('orderBy') || 'account_name';
        let orderDirection = request.header ('orderDirection') || 'asc';

        let bankAccounts = await BankAccount.query().where('user_id', userId)
                                                    .orderBy(orderBy, orderDirection)
                                                    .paginate(page, perPage);

        return bankAccounts;
    }

}
