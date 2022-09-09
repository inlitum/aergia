import Route  from '@ioc:Adonis/Core/Route';
import Logger from '@ioc:Adonis/Core/Logger';

Route.group( () => {
    Route.group( () => {
        // Api documentation path
        Route.get( 'api', async ( { view, response } ) => {
                       let docs;
                       try {
                           docs = await view.render( 'docs' );
                       } catch ( e ) {
                           return response.internalServerError( e );
                       }
                       return docs;
                   },
        );
        // Users
        Route.get( 'api/admin/users', 'UsersController.index' );
        Route.get( 'api/admin/users/:id', 'UsersController.read' );
        Route.put( 'api/admin/users/:id', 'UsersController.update' );
        Route.delete( 'api/admin/users/:id', 'UsersController.delete' );
        // Groups
        Route.get( 'api/admin/groups', 'GroupsController.index' );
        Route.post( 'api/admin/groups', 'GroupsController.create' );
        Route.get( 'api/admin/groups/:id', 'GroupsController.read' );
        Route.put( 'api/admin/groups/:id', 'GroupsController.update' );
        Route.delete( 'api/admin/groups/:id', 'GroupsController.delete' );
        // UserGroups
        Route.post( 'api/admin/user-groups', 'UserGroupsController.create' );
        Route.get( 'api/admin/user-groups/user/:user-id/', 'UserGroupsController.read' );
        Route.get( 'api/admin/user-groups/group/:group-id', 'UserGroupsController.read' );
        Route.get( 'api/admin/user-groups/user/:user-id/group/:group-id', 'UserGroupsController.read' );
        Route.put( 'api/admin/user-groups/user/:user-id/group/:group-id', 'UserGroupsController.update' );
        Route.delete( 'api/admin/user-groups/user/:user-id/group/:group-id', 'UserGroupsController.delete' );
        // Accounts
        Route.get('api/accounts', 'AccountsController.index');
        Route.get('api/accounts/:account-id', 'AccountsController.read');
        Route.post('api/accounts', 'AccountsController.create');
        Route.put('api/accounts/:account-id', 'AccountsController.update');
        Route.delete('api/accounts/:account-id', 'AccountsController.delete');
        // Tags
        Route.get('api/tags', 'TagsController.index');
        Route.get('api/tags/:id', 'TagsController.read');
        Route.post('api/tags', 'TagsController.create');
        Route.put('api/tags/:id', 'TagsController.update');
        Route.delete('api/tags/:id', 'TagsController.delete');

        Route.post( 'api/auth/logout', 'AuthController.logout' );
        Route.get( 'api/__status', 'StatusController.status' );
    })
    .middleware( 'auth:web' );

    Route.group( () => {
        Route.post( 'login', 'AuthController.login' );
        Route.post( 'register', 'AuthController.register' );
    } ).prefix( 'api/auth' );

    Route.get( '/', async ( { view } ) => {
        return await view.render( 'welcome', {} );
    } );

} ).middleware( async ( { request }, next ) => {
    Logger.info( `${ request.method() } ${ request.url() } ${ request.ip() }` );
    await next();
} );
