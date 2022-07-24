// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User   from 'App/Models/User';
import Logger from '@ioc:Adonis/Core/Logger';

export default class UsersController {

    userLogger = Logger.child( { name: 'UserController' } );

    public async index ( { auth, request, response } ) {
        let userId = await auth.use( 'web' ).user.id;

        if ( !userId ) {
            this.userLogger.warn( 'Invalid attempt to access all users: unauthorized user' );
            return response.unauthorized();
        }

        let user = await User.find( userId );

        if ( !user ) {
            this.userLogger.warn( 'Invalid attempt to access all users: unauthorized user' );
            return response.unauthorized();
        }

        await user.load( 'groups', ( query ) => {
            query.pivotColumns( [ 'write', 'read' ] )
        } );

        if ( !user.hasAdminWrite() ) {
            this.userLogger.warn( `User [${ user.username }] attempted to access 'All Users' api route: Unauthorized` )
            return response.unauthorized()
        }

        // Boring old pagination stuff.
        let page           = request.header( 'page' ) || 1;
        let perPage        = request.header( 'perPage' ) || 10;
        let orderBy        = request.header( 'orderBy' ) || 'username';
        let orderDirection = request.header( 'orderDirection' ) || 'asc';

        return await User.query().preload( 'groups', ( query ) => {
            query.pivotColumns( [ 'write', 'read' ] )
        } ).orderBy( orderBy, orderDirection ).paginate( page, perPage );
    }

    public async read ( { auth, request, response } ) {

    }

    public async update ( { auth, request, response } ) {

    }

    public async delete ( { auth, request, response } ) {

    }

}
