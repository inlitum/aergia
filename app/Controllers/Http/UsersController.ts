// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User              from 'App/Models/User';
import Logger            from '@ioc:Adonis/Core/Logger';
import Hash              from '@ioc:Adonis/Core/Hash';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import getCurrentUser    from 'App/Controllers/Http/Shared';

export default class UsersController {

    userLogger = Logger.child( { name: 'UsersController' } );

    public async index ( { auth, request, response } ) {
        let userId = await auth.use( 'web' ).user.id;

        if ( !userId ) {
            this.userLogger.warn( 'Invalid attempt to access all users: unauthorized user' );
            return response.unauthorized();
        }

        let user = await getCurrentUser( userId );

        if ( !user ) {
            this.userLogger.warn( 'Invalid attempt to access all users: unauthorized user' );
            return response.unauthorized();
        }

        if ( !user.hasAdminRead() ) {
            this.userLogger.warn( `User [${ user.username }] attempted to access 'All Users' api route: Unauthorized` )
            return response.unauthorized()
        }

        // Boring old pagination stuff.
        let page           = request.header( 'page' ) || 1;
        let perPage        = request.header( 'perPage' ) || 10;
        let orderBy        = request.header( 'orderBy' ) || 'username';
        let orderDirection = request.header( 'orderDirection' ) || 'asc';

        return await User.query().preload( 'userGroups', ( query ) => {
            query.preload( 'group' )
        } ).orderBy( orderBy, orderDirection ).paginate( page, perPage );
    }

    public async read ( { auth, request, response } ) {
        const currentUserId = auth.use( 'web' ).user.id;
        const requestUserId = request.param( 'id' );

        // Make sure there the current user has actually logged in
        if ( !currentUserId ) {
            this.userLogger.warn( `Attempt to access user [${ requestUserId }]: unauthorized` );
            return response.unauthorized();
        }

        const currentUser = await getCurrentUser( currentUserId );

        // Make sure the current user is valid.
        if ( !currentUser ) {
            this.userLogger.warn( `Attempt to access user [${ requestUserId }]: unauthorized` );
            return response.unauthorized();
        }

        // Check the current user is an admin or the request user.
        if ( !currentUser.hasAdminRead() && currentUserId != requestUserId ) {
            this.userLogger.warn( `User [${ currentUserId }] attempted to access user [${ requestUserId }]'s data: unauthorized` );
            return response.unauthorized();
        }

        // We can actually reuse the existing query for this user since we want
        // user groups as well.
        const requestUser = await getCurrentUser( requestUserId );

        if ( !requestUser ) {
            this.userLogger.warn( `User [${ currentUserId }] attempted to access user [${ requestUserId }]'s data: not found` );
            return response.notFound();
        }

        await requestUser.load('tags');
        await requestUser.load('accounts');

        return requestUser;
    }

    public async update ( { auth, request, response } ) {
        const currentUserId = auth.use( 'web' ).user.id;
        const requestUserId = request.param( 'id' );

        if ( !currentUserId ) {
            this.userLogger.warn( `Attempt to update user [${ requestUserId }]: unauthorized` );
            return response.unauthorized();
        }

        const user = await getCurrentUser( requestUserId );

        if ( !user ) {
            this.userLogger.warn( `Attempt to update user [${ requestUserId }]: unauthorized` );
            return response.unauthorized();
        }

        if ( !user.hasAdminWrite() && currentUserId != requestUserId ) {
            this.userLogger.warn( `User [${ currentUserId }] attempted to update user [${ requestUserId }]: unauthorized` );
            return response.unauthorized();
        }

        let requestUser = await User.query().where( 'user_id', requestUserId ).first();

        if ( !requestUser ) {
            return response.notFound();
        }

        const userUpdateSchema = schema.create( {
                                                    username: schema.string( {}, [ rules.minLength( 6 ), rules.nullable() ] ),
                                                    email   : schema.string( {}, [ rules.email(), rules.nullable() ] ),
                                                    password: schema.string( {}, [ rules.nullable() ] ),
                                                } );

        let payload;
        try {
            payload = await request.validate( {
                                                  schema: userUpdateSchema,
                                              } );
        } catch ( e ) {
            return response.badRequest( e );
        }
        let hasChange = false;

        let emailCheck = await User.query().where( 'email', payload.email ).whereNot( 'user_id', requestUserId ).first();

        if ( emailCheck != null ) {
            this.userLogger.warn( `User [${ currentUserId }] attempted to change user [${ requestUserId }]'s email to an existing email: bad request` );
            return response.badRequest();
        }

        if ( payload.email != null ) {
            requestUser.email = payload.email;
            hasChange         = true;
        }

        let usernameCheck = await User.query().where( 'username', payload.username ).whereNot( 'user_id', requestUserId ).first();

        if ( usernameCheck != null ) {
            this.userLogger.warn( `User [${ currentUserId }] attempted to change user [${ requestUserId }]'s username to an existing email: bad request` );
            return response.badRequest();
        }

        if ( payload.username != null ) {
            requestUser.username = payload.username;
            hasChange            = true;
        }
        if ( payload.password != null ) {
            requestUser.password = await Hash.make( payload.password );
            hasChange            = true;
        }

        if ( !hasChange ) {
            return requestUser;
        }

        try {
            await requestUser.save();
        } catch {
            return response.internalServerError();
        }

        return requestUser;
    }

    public async delete ( { auth, request, response } ) {
        const currentUserId = await auth.use( 'web' ).user.id;
        const requestUserId = request.param( 'id' );

        if ( !currentUserId ) {
            this.userLogger.warn( `Attempt to update user [${ requestUserId }]: unauthorized` );
            return response.unauthorized();
        }

        const user = await getCurrentUser( requestUserId );

        if ( !user ) {
            this.userLogger.warn( `Attempt to update user [${ requestUserId }]: unauthorized` );
            return response.unauthorized();
        }

        if ( !user.hasAdminWrite() && currentUserId != requestUserId ) {
            this.userLogger.warn( `User [${ currentUserId }] attempted to update user [${ requestUserId }]: unauthorized` );
            return response.unauthorized();
        }

        let requestUser = await User.query().where( 'user_id', requestUserId ).first();

        if ( !requestUser ) {
            return response.notFound();
        }

        try {
            await requestUser.delete();
        } catch ( e ) {
            return response.internalServerError( e );
        }
        return requestUser;
    }

}
