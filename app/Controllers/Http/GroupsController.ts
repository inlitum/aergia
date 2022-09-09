// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Logger            from '@ioc:Adonis/Core/Logger';
import getCurrentUser    from 'App/Controllers/Http/Shared';
import Group             from 'App/Models/Group';
import { rules, schema } from '@ioc:Adonis/Core/Validator';

export default class GroupsController {

    groupLogger = Logger.child( { name: 'GroupsController' } );

    public async index ( { auth, request, response } ) {
        const userId = await auth.use( 'web' ).user.id;

        if ( !userId ) {
            this.groupLogger.warn( 'Invalid attempt to access all groups: unauthorized user' );
            return response.unauthorized();
        }

        let user = await getCurrentUser( userId );

        if ( !user ) {
            this.groupLogger.warn( 'Invalid attempt to access all groups: unauthorized user' );
            return response.unauthorized();
        }

        if ( !user.hasAdminRead() ) {
            this.groupLogger.warn( `User [${ user.username }] attempted to access 'All Groups' api route: Unauthorized` )
            return response.unauthorized()
        }

        // Boring old pagination stuff.
        let page           = request.header( 'page' ) || 1;
        let perPage        = request.header( 'perPage' ) || 10;
        let orderBy        = request.header( 'orderBy' ) || 'group_name';
        let orderDirection = request.header( 'orderDirection' ) || 'asc';

        return await Group.query().preload( 'userGroups', ( query ) => {
            query.preload( 'user' )
        } ).orderBy( orderBy, orderDirection ).paginate( page, perPage );
    }


    public async read ( { auth, request, response } ) {
        const userId = await auth.use( 'web' ).user.id;

        if ( !userId ) {
            this.groupLogger.warn( 'Invalid attempt to access group: unauthorized user' );
            return response.unauthorized();
        }

        let user = await getCurrentUser( userId );

        if ( !user ) {
            this.groupLogger.warn( 'Invalid attempt to access group: unauthorized user' );
            return response.unauthorized();
        }

        if ( !user.hasAdminRead() ) {
            this.groupLogger.warn( `User [${ user.username }] attempted to access 'All Users' api route: Unauthorized` )
            return response.unauthorized()
        }

        const groupId = request.param( 'id' );

        if ( !groupId ) {
            this.groupLogger.warn( `User [${ user.username }] attempted to access group [${ groupId }]: Not found` )
            return response.notFound()
        }

        let group = await Group.query()
                               .where( 'group_id', groupId )
                               .preload( 'userGroups', ( query ) => {
                                   query.preload( 'user' );
                               } ).first();

        if ( !group ) {
            this.groupLogger.warn( `User [${ user.username }] attempted to access group [${ groupId }]: Not found` )
            return response.notFound()
        }

        if ( group.parentGroupId != null ) {
            await group.load( 'parentGroup' );
        }

        return group;
    }

    public async create ( { auth, request, response } ) {
        const userId = await auth.use( 'web' ).user.id;

        if ( !userId ) {
            this.groupLogger.warn( 'Invalid attempt to access all users: unauthorized user' );
            return response.unauthorized();
        }

        let user = await getCurrentUser( userId );

        if ( !user ) {
            this.groupLogger.warn( 'Invalid attempt to access all users: unauthorized user' );
            return response.unauthorized();
        }

        if ( !user.hasAdminWrite() ) {
            this.groupLogger.warn( `User [${ user.username }] attempted to access 'All Users' api route: Unauthorized` )
            return response.unauthorized()
        }

        const groupSchema = schema.create( {
                                               groupName    : schema.string( { trim: true }, [ rules.minLength( 6 ), rules.maxLength( 255 ), rules.unique( {
                                                                                                                                                               table          : 'groups',
                                                                                                                                                               column         : 'group_name',
                                                                                                                                                               caseInsensitive: true,
                                                                                                                                                           } ) ] ),
                                               parentGroupId: schema.number(),
                                           } );
        let payload;
        try {
            payload = await request.validate( { schema: groupSchema } );
        } catch ( e ) {
            return response.badRequest( e );
        }

        let newGroup          = new Group();
        newGroup.groupName    = payload.groupName;
        newGroup.creationUser = user.username;
        newGroup.updateUser   = user.username;

        if ( payload.parentGroupId != null ) {
            let parentGroup = await Group.query().where( 'group_id', payload.parentGroupId ).first();

            if ( !parentGroup ) {
                return response.badRequest( 'Group\'s parent group id does not match a valid group parent id' );
            }

            newGroup.parentGroupId = payload.parentGroupId;
        }

        try {
            await newGroup.save()
        } catch ( e ) {
            return response.internalServerError( e );
        }

        return newGroup;
    }

    public async update ( { auth, request, response } ) {
        const userId = await auth.use( 'web' ).user.id;

        if ( !userId ) {
            this.groupLogger.warn( 'Invalid attempt to access all users: unauthorized user' );
            return response.unauthorized();
        }

        let user = await getCurrentUser( userId );

        if ( !user ) {
            this.groupLogger.warn( 'Invalid attempt to access all users: unauthorized user' );
            return response.unauthorized();
        }

        if ( !user.hasAdminWrite() ) {
            this.groupLogger.warn( `User [${ user.username }] attempted to access 'All Users' api route: Unauthorized` )
            return response.unauthorized()
        }

        const groupId = request.param( 'id' );

        if ( !groupId ) {
            this.groupLogger.warn( `User [${ user.username }] attempted to access group [${ groupId }]: Not found` )
            return response.notFound()
        }

        let group = await Group.query()
                               .where( 'group_id', groupId )
                               .first();

        if ( !group ) {
            this.groupLogger.warn( `User [${ user.username }] attempted to access group [${ groupId }]: Not found` )
            return response.notFound()
        }

        const groupSchema = schema.create( {
                                               groupName    : schema.string( { trim: true }, [ rules.minLength( 6 ), rules.maxLength( 255 ) ] ),
                                               parentGroupId: schema.number(),
                                           } );
        let payload;
        try {
            payload = await request.validate( { schema: groupSchema } );
        } catch ( e ) {
            return response.badRequest( e );
        }

        let hasChange = false;

        if ( payload.groupName ) {
            let checkGroup = await Group.query().where( 'group_name', payload.groupName ).whereNot( 'group_id', groupId ).first();

            if ( checkGroup != null ) {
                return response.badRequest()
            }

            group.groupName = payload.groupName;
            hasChange       = true;
        }

        if ( payload.parentGroupId ) {
            let parentGroup = await Group.query().where( 'group_id', payload.parentGroupId ).first();

            if ( !parentGroup ) {
                return response.badRequest();
            }

            parentGroup.parentGroupId = payload.parentGroupId;
            hasChange                 = true;
        }

        if ( hasChange ) {
            try {
                await group.save();
            } catch ( e ) {
                return response.internalServerError( e );
            }
        }

        return group;
    }

    public async delete ( { auth, request, response } ) {
        const userId = await auth.use( 'web' ).user.id;

        if ( !userId ) {
            this.groupLogger.warn( 'Invalid attempt to access all users: unauthorized user' );
            return response.unauthorized();
        }

        let user = await getCurrentUser( userId );

        if ( !user ) {
            this.groupLogger.warn( 'Invalid attempt to access all users: unauthorized user' );
            return response.unauthorized();
        }

        if ( !user.hasAdminWrite() ) {
            this.groupLogger.warn( `User [${ user.username }] attempted to access 'All Users' api route: Unauthorized` )
            return response.unauthorized()
        }

        const groupId = request.param( 'id' );

        if ( !groupId ) {
            this.groupLogger.warn( `User [${ user.username }] attempted to access group [${ groupId }]: Not found` )
            return response.notFound()
        }

        let group = await Group.query()
                               .where( 'group_id', groupId )
                               .first();

        if ( !group ) {
            this.groupLogger.warn( `User [${ user.username }] attempted to access group [${ groupId }]: Not found` )
            return response.notFound()
        }

        try {
            await group.delete();
        } catch ( e ) {
            return response.internalServerError( e );
        }

        return response.ok();
    }
}
