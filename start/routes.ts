import Route from '@ioc:Adonis/Core/Route';


Route.group (() => {
    // Accounts
    Route.group (() => {
        Route.get ('accounts', 'AccountsController.index');
        Route.get ('account/:id', 'AccountsController.show');
        Route.post ('account', 'AccountsController.create');
        Route.put ('account/:id', 'AccountsController.update')
        Route.delete ('account/:id', 'AccountsController.destroy')
    });
    // Transactions
    Route.group (() => {
        Route.get ('transactions', 'TransactionsController.index');
        Route.get ('transaction/:id', 'TransactionsController.show');
        Route.post ('transaction', 'TransactionsController.create');
        Route.put ('transaction/:id', 'TransactionsController.update');
        Route.delete ('transaction/:id', 'TransactionsController.destroy');
    }).prefix ('account/:account_id');

    Route.get ('transactions', 'TransactionsController.index');

    Route.group (() => {
        Route.get ('ingredient/:id', 'IngredientsController.show');
    });

    Route.get ('ingredients', 'IngredientsController.index');

}).middleware ('auth:api').prefix ('api');

Route.group (() => {
    Route.post ('login', 'AuthController.login');
    Route.post ('register', 'AuthController.register');
})



Route.get('/', async ({view}) => {
    return await view.render('welcome', {});
})
