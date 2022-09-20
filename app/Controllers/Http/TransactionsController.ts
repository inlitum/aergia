import Logger            from '@ioc:Adonis/Core/Logger';
import getCurrentUser    from 'App/Controllers/Http/Shared';
import Transaction       from 'App/Models/Transaction';
import { rules, schema } from '@ioc:Adonis/Core/Validator';

export default class TransactionsController {
    transactionsLogger = Logger.child ({ name: 'TransactionsController' });

    public async index ({ auth, request, response }) {
        const userId           = await auth.use ('web').user.id;
        const requestAccountId = request.param ('account_id');

        console.log(request.params())

        if (!userId) {
            this.transactionsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        let user = await getCurrentUser (userId);

        if (!user) {
            this.transactionsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        if (!user.hasAdminRead () && !(requestAccountId && user.hasReadGroup ('actions') && user.hasReadGroup ('transactions'))) {
            this.transactionsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        let page           = request.header ('page') || 1;
        let perPage        = request.header ('perPage') || 10;
        let orderBy        = request.header ('orderBy') || 'description';
        let orderDirection = request.header ('orderDirection') || 'asc';

        console.log(requestAccountId)
        if (requestAccountId != null) {
            return await Transaction.query ()
            .where ('account_id', requestAccountId)
            .orderBy (orderBy, orderDirection)
            .paginate (page, perPage);

        } else {
            return await Transaction.query ()
            .orderBy (orderBy, orderDirection)
            .paginate (page, perPage);
        }
    }

    public async read ({ auth, request, response }) {
        const userId    = await auth.use ('web').user.id;
        const transactionId = request.param ('transaction-id');

        if (!userId) {
            this.transactionsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        let user = await getCurrentUser (userId);

        if (!user) {
            this.transactionsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        if (!user.hasAdminRead () && !user.hasReadGroup ('transactions')) {
            this.transactionsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        if (!transactionId) {
            this.transactionsLogger.warn ('TODO #2');
            return response.notFound ();
        }

        const transaction = await Transaction.query ()
        .where ('account_id', transactionId)
        .first ();

        if (!transaction) {
            this.transactionsLogger.warn ('TODO #1');
            return response.notFound ();
        }

        return transaction;
    }

    public async create ({ auth, request, response }) {
        const userId = await auth.use ('web').user.id;

        if (!userId) {
            this.transactionsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        let user = await getCurrentUser (userId);

        if (!user) {
            this.transactionsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        if (!user.hasAdminWrite () && !user.hasWriteGroup ('accounts') && !user.hasWriteGroup ('transactions')) {
            this.transactionsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        const transactionSchema = schema.create ({
            description: schema.string ({ trim: true }, [ rules.minLength (5) ]),
            amount: schema.number (),
            account_id: schema.number()
        });

        let payload;
        try {
            payload = await request.validate ({ schema: transactionSchema });
        } catch (e) {
            this.transactionsLogger.warn ('TODO');
            return response.badRequest (e);
        }

        let transaction          = new Transaction ();
        transaction.accountId    = payload.account_id;
        transaction.amount       = payload.amount;
        transaction.description  = payload.description;
        transaction.creationUser = user.username;
        transaction.updateUser   = user.username;

        try {
            await transaction.save ();
        } catch (e) {
            this.transactionsLogger.warn ('TODO');
            return response.internalServerError (e);
        }

        return transaction;
    }

    public async update ({ auth, request, response }) {
        const userId    = await auth.use ('web').user.id;
        const transactionId = request.param ('transaction-id');

        if (!userId) {
            this.transactionsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        let user = await getCurrentUser (userId);

        if (!user) {
            this.transactionsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        if (!user.hasAdminWrite () && !user.hasWriteGroup ('transactions')) {
            this.transactionsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        let transaction = await Transaction.query ().where ('transaction_id', transactionId).first ();

        if (transaction == null) {
            this.transactionsLogger.warn ('TODO');
            return response.notFound ();
        }

        const transactionSchema = schema.create ({
            description: schema.string ({ trim: true }, [ rules.minLength (5)]),
            amount: schema.number ()
        });

        let payload;
        try {
            payload = await request.validate ({ schema: transactionSchema });
        } catch (e) {
            this.transactionsLogger.warn ('TODO');
            return response.badRequest (e);
        }

        transaction.description = payload.account_name;
        transaction.amount      = payload.amount;
        transaction.updateUser  = user.username;

        try {
            await transaction.save ();
        } catch (e) {
            this.transactionsLogger.warn ('TODO');
            return response.internalServerError (e);
        }

        return transaction;
    }

    public async delete ({ auth, request, response }) {
        const userId    = await auth.use ('web').user.id;
        const transactionId = request.param ('transaction-id');

        if (!userId) {
            this.transactionsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        let user = await getCurrentUser (userId);

        if (!user) {
            this.transactionsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        if (!user.hasAdminWrite () && !user.hasWriteGroup ('transactions')) {
            this.transactionsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        let transaction = await Transaction.query ().where ('transaction_id', transactionId).first ();

        if (transaction == null) {
            this.transactionsLogger.warn ('TODO');
            return response.notFound ();
        }

        try {
            await transaction.delete ();
            return response.ok ();
        } catch (e) {
            this.transactionsLogger.warn ('TODO');
            return response.internalServerError (e);
        }
    }
}
