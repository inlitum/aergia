import Account           from 'App/Models/Account';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import { DateTime }      from 'luxon';

export default class AccountsController {
    public async index ({ auth, request }) {
        let offset         = request.header ('offset') || 1;
        let perPage        = request.header ('perPage') || 10;
        let orderBy        = request.header ('orderBy') || 'name';
        let orderDirection = request.header ('orderDirection') || 'asc';

        let userId = auth.use ('api').user.id;

        return await Account.query ()
                            .where ('user_id', userId)
                            .orderBy (orderBy, orderDirection)
                            .paginate (offset, perPage);
    }

    public async show ({ auth, request, response }) {
        let id     = request.params ().id;
        let userId = auth.use ('api').user.id;

        let account = await Account.query ()
                                   .from ('accounts')
                                   .where ('id', id)
                                   .where ('user_id', userId)
                                   .first ();

        if (!account) {
            return response.notFound ();
        }

        // await account.load('transactions');
        //
        // let amount = account.startingAmount;
        //
        // account.transactions.forEach(transaction => {
        //     if (transaction.deposit) {
        //         amount += transaction.amount;
        //     } else {
        //         amount -= transaction.amount;
        //     }
        // })

        // if (amount != account.currentAmount) {
        //     account.currentAmount = amount;
        //     await account.save();
        // }

        return account;
    }

    public async create ({ auth, request, response }) {
        const accountSchema = schema.create ({
            name:           schema.string ({}, [rules.minLength (4)]),
            startingAmount: schema.number (),
        });

        const payload = await request.validate ({ schema: accountSchema });

        let userId = auth.use ('api').user.id;

        let account            = new Account ();
        account.name           = payload.name;
        account.startingAmount = payload.startingAmount;
        account.currentAmount  = payload.startingAmount;
        account.userId         = userId;

        try {
            await account.save ();
        } catch (e) {
            // Something went wrong here
            console.log (e);
            return response.internalServerError ();
        }

        return account;
    }

    public async update ({ auth, request, response }) {
        const accountSchema = schema.create ({
            name:          schema.string ({}, [rules.minLength (4)]),
            currentAmount: schema.number (),
        });

        const payload = await request.validate ({ schema: accountSchema });
        let accountId = request.params ().id;
        let userId    = auth.use ('api').user.id;

        let account = await Account.query ().where ('id', accountId).where ('user_id', userId).first ();

        if (!account) {
            return response.badRequest ();
        }

        account.name      = payload.name;
        account.updatedAt = DateTime.now ();

        try {
            await account.save ();
        } catch (e) {
            // Something went wrong here
            return response.internalServerError ();
        }
        // The account has been created.
        return account;
    }

    public async destroy ({ auth, request, response }) {
        let accountId = request.params ().id;
        let userId    = auth.use ('api').user.id;

        let account = await Account.query ().where ('id', accountId).where ('user_id', userId).first ();

        if (!account) {
            console.log (accountId, userId);
            return response.badRequest ();
        }

        await account.load ('transactions');

        try {
            for (let i = account.transactions.length - 1; i >= 0; i--) {
                let transaction = account.transactions[ i ];

                await transaction.delete ();
            }
        } catch (e) {
            return response.internalServerError ();
        }

        try {
            await account.delete ();
        } catch (e) {
            return response.internalServerError ();
        }

        return accountId;
    }
}
