// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import getCurrentUser from './Shared';
import Logger         from '@ioc:Adonis/Core/Logger';
import UserGroup      from 'App/Models/UserGroup';
import { schema }     from '@ioc:Adonis/Core/Validator';
import User           from 'App/Models/User';
import Group          from 'App/Models/Group';
import { DateTime }   from 'luxon';

export default class UserGroupsController {

    userGroupLogger = Logger.child( { name: 'UserGroupsController' } )

    public async read ( { auth, request, response } ) {
        const userId         = await auth.use( 'web' ).user.id;
        const requestUserId  = request.param( 'user-id' );
        const requestGroupId = request.param( 'group-id' );

        if ( !userId ) {
            this.userGroupLogger.warn( 'Invalid attempt to access all users: unauthorized user' );
            return response.unauthorized();
        }

        let user = await getCurrentUser( userId );

        if ( !user ) {
            this.userGroupLogger.warn( 'Invalid attempt to access all users: unauthorized user' );
            return response.unauthorized();
        }

        if ( !user.hasAdminRead() ) {
            this.userGroupLogger.warn( `User [${ user.username }] attempted to access 'All Users' api route: Unauthorized` )
            return response.unauthorized()
        }

        let userGroup;

        if ( requestUserId && requestGroupId ) {
            userGroup = await UserGroup.query()
                                       .where( 'user_id', requestUserId )
                                       .where( 'group_id', requestGroupId )
                                       .first();
        } else if ( requestUserId ) {
            userGroup = await UserGroup.query()
                                       .where( 'user_id', requestUserId )
        } else if ( requestGroupId ) {
            userGroup = await UserGroup.query()
                                       .where( 'group_id', requestGroupId )
        } else {
            return response.badRequest();
        }

        return userGroup;
    }

    public async create ( { auth, request, response } ) {
        const userId = await auth.use( 'web' ).user.id;

        if ( !userId ) {
            this.userGroupLogger.warn( 'Invalid attempt to access all users: unauthorized user' );
            return response.unauthorized();
        }

        let user = await getCurrentUser( userId );

        if ( !user ) {
            this.userGroupLogger.warn( 'Invalid attempt to access all users: unauthorized user' );
            return response.unauthorized();
        }

        if ( !user.hasAdminWrite() ) {
            this.userGroupLogger.warn( `User [${ user.username }] attempted to access 'All Users' api route: Unauthorized` )
            return response.unauthorized()
        }

        const userGroupSchema = schema.create( {
                                                   userId : schema.number(),
                                                   groupId: schema.number(),
                                                   read   : schema.boolean(),
                                                   write  : schema.boolean(),
                                               } );

        let payload;
        try {
            payload = await request.validate( { schema: userGroupSchema } );
        } catch ( e ) {
            return response.badRequest( e )
        }

        let userGroup          = new UserGroup();
        userGroup.read         = payload.read;
        userGroup.write        = payload.write;
        userGroup.updateUser   = user.username;
        userGroup.creationUser = user.username;

        if ( payload.userId ) {
            let userCheck = await User.query().where( 'user_id', payload.userId ).first();

            if ( !userCheck ) {
                return response.badRequest();
            }

            userGroup.userId = payload.userId;
        }

        if ( payload.groupId ) {
            let groupCheck = await Group.query().where( 'group_id', payload.groupId ).first();

            if ( !groupCheck ) {
                return response.badRequest();
            }

            userGroup.groupId = payload.groupId;
        }

        return userGroup;
    }

    public async update ( { auth, request, response } ) {
        const userId = await auth.use( 'web' ).user.id;

        if ( !userId ) {
            this.userGroupLogger.warn( 'Invalid attempt to access group: unauthorized user' );
            return response.unauthorized();
        }

        let user = await getCurrentUser( userId );

        if ( !user ) {
            this.userGroupLogger.warn( 'Invalid attempt to access group: unauthorized user' );
            return response.unauthorized();
        }

        if ( !user.hasAdminWrite() ) {
            this.userGroupLogger.warn( `User [${ user.username }] attempted to access 'All Users' api route: Unauthorized` )
            return response.unauthorized()
        }

        const requestUserId = request.param( 'user-id' );
        const groupId       = request.param( 'group-id' );

        if ( !requestUserId || !groupId ) {
            return response.badRequest();
        }

        let userGroup = await UserGroup.query()
                                       .where( 'user_id', requestUserId )
                                       .where( 'group_id', groupId )
                                       .first();

        if ( !userGroup ) {
            return response.notFound();
        }

        const userGroupSchema = schema.create( {
                                                   read : schema.boolean(),
                                                   write: schema.boolean(),
                                               } );
        let payload;
        try {
            payload = await request.validate( { schema: userGroupSchema } );
        } catch ( e ) {
            return response.badRequest( e );
        }

        let hasChange = false;

        if ( payload.read != null ) {
            userGroup.read = payload.read;
            hasChange      = true;
        }

        if ( payload.write != null ) {
            userGroup.write = payload.write;
            hasChange       = true;
        }

        if ( hasChange ) {
            try {
                userGroup.updateUser = user.username;
                userGroup.updateDate = DateTime.now();
                await userGroup.save();
            } catch ( e ) {
                return response.internalServerError( e );
            }
        }

        return userGroup;
    }

    public async delete ( { auth, request, response } ) {
        const userId         = await auth.use( 'web' ).user.id;
        const requestUserId  = request.param( 'user-id' );
        const requestGroupId = request.param( 'group-id' );

        if ( !userId ) {
            return response.unauthorized();
        }

        let user = await getCurrentUser( userId );

        if ( !user ) {
            return response.unauthorized();
        }

        if ( !user.hasAdminWrite() ) {
            return response.unauthorized()
        }

        if ( !requestUserId || !requestGroupId ) {
            return response.badRequest();
        }

        let userGroup = await UserGroup.query()
                                       .where( 'user_id', requestUserId )
                                       .where( 'group_id', requestGroupId )
                                       .first();

        if ( !userGroup ) {
            return response.notFound();
        }

        try {
            await userGroup.delete();
        } catch ( e ) {
            return response.internal( e )
        }

        return response.ok();
    }

}
