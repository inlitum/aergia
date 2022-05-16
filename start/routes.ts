import Route from '@ioc:Adonis/Core/Route';

// Route.get('/api/accounts', 'AccountsController.index').middleware('auth:api');
//
// Route.get       ('accounts', 'AccountsController.index').middleware('auth:api');
// Route.get       ('account/:id', 'AccountsController.show').middleware('auth:api');
// Route.post      ('account', 'AccountsController.create').middleware('auth:api');
// Route.put       ('account/:id', 'AccountsController.update').middleware('auth:api');
// Route.delete    ('account/:id', 'AccountsController.destroy').middleware('auth:api');
// Route.get       ('transactions', 'TransactionsController.index').middleware('auth:api');
// Route.get       ('transaction/:id', 'TransactionsController.show').middleware('auth:api');
// Route.post      ('transaction', 'TransactionsController.create').middleware('auth:api');
// Route.put       ('transaction/:id', 'TransactionsController.update').middleware('auth:api');
// Route.delete    ('transaction/:id', 'TransactionsController.destroy').middleware('auth:api');
//
// Route.post      ('login', 'AuthController.login');
// Route.post      ('register', 'AuthController.register');
// //
Route.resource('tests', 'TestsController');

// Route.get('/', async ({view}) => {
//     return await view.render('welcome', {});
// })

Route.get('/', () => {
    return 'Hello World';
});
