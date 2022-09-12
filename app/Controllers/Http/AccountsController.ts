import Logger            from '@ioc:Adonis/Core/Logger';
import getCurrentUser    from 'App/Controllers/Http/Shared';
import Account           from 'App/Models/Account';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import Transaction       from 'App/Models/Transaction';

export default class AccountsController {

    accountsLogger = Logger.child ({ name: 'AccountsController' });

    public async index ({ auth, request, response }) {
        const userId        = await auth.use ('web').user.id;
        const requestUserId = request.param ('user-id');

        if (!userId) {
            this.accountsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        let user = await getCurrentUser (userId);

        if (!user) {
            this.accountsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        if (!user.hasAdminRead () && !user.hasReadGroup ('accounts')) {
            this.accountsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        let page           = request.header ('page') || 1;
        let perPage        = request.header ('perPage') || 10;
        let orderBy        = request.header ('orderBy') || 'account_name';
        let orderDirection = request.header ('orderDirection') || 'asc';

        if (requestUserId) {
            return await Account.query ()
            .where ('user_id', requestUserId)
            .preload ('transactions')
            .orderBy (orderBy, orderDirection)
            .paginate (page, perPage);

        } else {
            return await Account.query ()
            .preload ('transactions')
            .orderBy (orderBy, orderDirection)
            .paginate (page, perPage);
        }
    }

    public async read ({ auth, request, response }) {
        const userId    = await auth.use ('web').user.id;
        const accountId = request.param ('account-id');

        if (!userId) {
            this.accountsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        let user = await getCurrentUser (userId);

        if (!user) {
            this.accountsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        if (!user.hasAdminRead () && !user.hasReadGroup ('accounts')) {
            this.accountsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        if (!accountId) {
            this.accountsLogger.warn ('TODO #2');
            return response.notFound ();
        }

        const account = await Account.query ()
        .where ('account_id', accountId)
        .preload ('transactions')
        .first ();

        if (!account) {
            this.accountsLogger.warn ('TODO #1');
            return response.notFound ();
        }

        return account;
    }

    public async create ({ auth, request, response }) {
        const userId = await auth.use ('web').user.id;

        if (!userId) {
            this.accountsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        let user = await getCurrentUser (userId);

        if (!user) {
            this.accountsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        if (!user.hasAdminWrite () && !user.hasWriteGroup ('accounts')) {
            this.accountsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        const accountSchema = schema.create ({
            account_name: schema.string ({ trim: true }, [ rules.minLength (5), rules.maxLength (255) ]),
            starting_amount: schema.number (),
        });

        let payload;
        try {
            payload = await request.validate ({ schema: accountSchema });
        } catch (e) {
            this.accountsLogger.warn ('TODO');
            return response.badRequest (e);
        }

        let account          = new Account ();
        account.accountName  = payload.account_name;
        account.userId       = userId;
        account.creationUser = user.username;
        account.updateUser   = user.username;

        try {
            await account.save ();
        } catch (e) {
            this.accountsLogger.warn ('TODO');
            return response.internalServerError (e);
        }

        let startingAmount          = new Transaction ();
        startingAmount.amount       = payload.starting_amount;
        startingAmount.description  = 'Starting balance.';
        startingAmount.accountId    = account.accountId;
        startingAmount.creationUser = user.username;
        startingAmount.updateUser   = user.username;

        try {
            await startingAmount.save ();
        } catch (e) {
            this.accountsLogger.warn (`Internal server error when attempting to save starting balance for Account [${account.accountId}].`);
            return response.internalServerError (e);
        }

        await account.load ('transactions');

        return account;
    }

    public async update ({ auth, request, response }) {
        const userId    = await auth.use ('web').user.id;
        const accountId = request.param ('account-id');

        if (!userId) {
            this.accountsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        let user = await getCurrentUser (userId);

        if (!user) {
            this.accountsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        if (!user.hasAdminWrite () && !user.hasWriteGroup ('accounts')) {
            this.accountsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        let account = await Account.query ().where ('account_id', accountId).first ();

        if (account == null) {
            this.accountsLogger.warn ('TODO');
            return response.notFound ();
        }

        const accountSchema = schema.create ({
            account_name: schema.string ({ trim: true }, [ rules.minLength (5), rules.maxLength (255) ])
        });

        let payload;
        try {
            payload = await request.validate ({ schema: accountSchema });
        } catch (e) {
            this.accountsLogger.warn ('TODO');
            return response.badRequest (e);
        }

        account.accountName = payload.account_name;
        account.updateUser  = user.username;

        try {
            await account.save ();
        } catch (e) {
            this.accountsLogger.warn ('TODO');
            return response.internalServerError (e);
        }

        return account;
    }

    public async delete ({ auth, request, response }) {
        const userId    = await auth.use ('web').user.id;
        const accountId = request.param ('account-id');

        if (!userId) {
            this.accountsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        let user = await getCurrentUser (userId);

        if (!user) {
            this.accountsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        if (!user.hasAdminWrite () && !user.hasWriteGroup ('accounts')) {
            this.accountsLogger.warn ('TODO');
            return response.unauthorized ();
        }

        let account = await Account.query ().where ('account_id', accountId).first ();

        if (account == null) {
            this.accountsLogger.warn ('TODO');
            return response.notFound ();
        }

        try {
            await account.delete ();
            return response.ok ();
        } catch (e) {
            this.accountsLogger.warn ('TODO');
            return response.internalServerError (e);
        }
    }
}
