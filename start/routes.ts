import Route from '@ioc:Adonis/Core/Route';

Route.group (() => {
         // Api documentation path
         Route.get ('api', async ({ view }) => {return await view.render ('api');});
         // Users
         Route.get ('api/admin/users', 'UsersController.index');
         Route.get ('api/admin/users/:id', 'UsersController.read');
         Route.put ('api/admin/users/:id', 'UsersController.update');
         Route.delete ('api/admin/users/:id', 'UsersController.delete');
         // Groups
         Route.get ('api/admin/groups', 'GroupsController.index');
         Route.post ('api/admin/groups/:id', 'GroupsController.create');
         Route.get ('api/admin/groups/:id', 'GroupsController.read');
         Route.put ('api/admin/groups/:id', 'GroupsController.update');
         Route.delete ('api/admin/groups/:id', 'GroupsController.delete');
         // User Groups
         Route.post ('api/admin/user-groups', 'UserGroupsController.create');
         Route.delete ('api/admin/user-groups', 'UserGroupsController.delete');
     })
     .middleware ('auth:api');

Route.group (() => {
    Route.post ('login', 'AuthController.login');
    Route.post ('register', 'AuthController.register');
}).prefix ('auth');

Route.get ('/', async ({ view }) => {
    return await view.render ('welcome', {});
});
