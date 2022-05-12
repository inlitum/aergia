// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Transaction  from 'App/Models/Transaction';
import { schema }   from '@ioc:Adonis/Core/Validator';
import { DateTime } from 'luxon';
import Account from "App/Models/Account";

export default class TransactionsController {

    /**
     * Get all transactions for either account or user
     * @param auth
     * @param request The request can have an account_id param.
     * @param response
     */
    public async index ({ auth, request, response, logger }) {
        let accountId = request.params ()[ 'account_id' ];
        let userId = auth.use ('api').user.id;
        // Generic pagination header stuff
        let page = request.header('page') || 1;
        let perPage = request.header('perPage') || 30;
        let orderBy = request.header('orderBy') || 'created_at';
        let orderDirection = request.header('orderDirection') || 'desc';

        if (accountId) {
            let transactions = await Transaction
            .query ()
            .where ('account_id', accountId)
            .orderBy (orderBy, orderDirection)
            .paginate (page, perPage);

            logger.info(`Found [${transactions.length}] transactions for User [${userId}]'s account [${accountId}]. Sort fields are [${orderBy},${orderDirection}] with pagination of [${page},${perPage}]`)

            return response.ok (transactions);
        }

        // To reach this point the request must have a valid login.
        // If there is no account id then the request must be the user's transactions
        let transactions = await Transaction
        .query ()
        .where ('user_id', userId)
        .orderBy (orderBy, orderDirection)
        .paginate (page, perPage);
        return response.ok (transactions);
    }

    /**
     * Shows the one transaction, this may not be needed but good to have just in case.
     * @param auth
     * @param request
     * @param response
     */
    public async show ({ auth, request, response }) {
        let id = request.params ().id;
        let accountId = request.params()['account_id'];

        let transaction = await Transaction
        .query ()
        .where ('id', id)
        .where ('account_id', accountId)
        .where ('user_id', auth.use ('api').user.id)
        .first ();

        if (!transaction) {
            return response.notFound ();
        }

        return response.ok (transaction);
    }

    public async create ({ auth, request, response }) {
        let userId = auth.use ('api').user.id;
        let accountId = request.params()['account_id'];

        const transactionSchema = schema.create ({
            reason: schema.string (),
            amount: schema.number (),
            deposit: schema.boolean ()
        });

        const payload = await request.validate ({ schema: transactionSchema });

        let transaction       = new Transaction ();
        transaction.reason    = payload.reason;
        transaction.amount    = payload.amount;
        transaction.deposit   = payload.deposit;

        transaction.accountId = accountId;
        transaction.userId    = userId;

        try {
            await transaction.save ();
        } catch (e) {
            return response.internalServerError ();
        }

        let account = await Account.find(transaction.accountId);

        if (!account) {
            return response.internalServerError();
        }

        if (!account?.addAmount(transaction.amount, transaction.deposit)) {
            return response.internalServerError();
        }

        return transaction;
    }

    public async update ({ auth, request, response }) {
        let id     = request.params ().id;
        let userId = auth.use ('api').user.id;
        let accountId = request.params()['account_id'];

        const transactionSchema = schema.create ({
            reason: schema.string (),
            amount: schema.number (),
            deposit: schema.boolean ()
        });

        let payload = await request.validate ({ schema: transactionSchema });

        let transaction = await Transaction
        .query ()
        .where ('id', id)
        .where ('account_id', accountId)
        .where ('user_id', userId)
        .first ();

        if (!transaction) {
            return response.notFound ();
        }

        transaction.reason    = payload.reason;
        transaction.amount    = payload.amount;
        transaction.deposit   = payload.deposit;
        transaction.updatedAt = DateTime.now ();

        try {
            await transaction.save ();
        } catch (e) {
            return response.internalServerError ();
        }

        return transaction;
    }

    public async destroy ({ auth, request, response }) {
        let id     = request.params ().id;
        let userId = auth.use ('api').user.id;
        let accountId = request.params()['account_id'];

        let transaction = await Transaction
        .query ()
        .where ('id', id)
        .where ('account_id', accountId)
        .where ('user_id', userId)
        .first ();

        if (!transaction) {
            return response.notFound ();
        }

        try {
            await transaction.delete ();
        } catch (e) {
            return response.internalServerError ();
        }

        return id;
    }
}
