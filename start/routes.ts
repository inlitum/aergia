import Route from '@ioc:Adonis/Core/Route';

Route.group (() => {
         Route.get ('api/admin/users', 'UsersController.index');
         // Route.post('api/admin/users', 'UsersController.index');
         // Route.get('api/admin/groups', 'GroupsController.index');

     })
     .middleware ('auth:api');

Route.group (() => {
    Route.post ('login', 'AuthController.login');
    Route.post ('register', 'AuthController.register');
}).prefix ('auth');

Route.get ('/', async ({ view }) => {
    return await view.render ('welcome', {});
});
