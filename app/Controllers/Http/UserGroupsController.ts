// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User       from 'App/Models/User';
import { schema } from '@ioc:Adonis/Core/Validator';
import Group      from 'App/Models/Group';
import Database from '@ioc:Adonis/Lucid/Database';

export default class UserGroupsController {
    public async create ({ auth, request, response }) {
        let currentUserId = auth.use ('web').user.id;

        let currentUser = await User.query ().where ('user_id', currentUserId).preload ('userGroups').first ();

        if (!currentUser) {
            return response.notFound ();
        }

        if (!(currentUser.hasAdminWrite ())) {
            return response.unauthorized ();
        }

        let userGroupSchema = schema.create ({
            "user_id":  schema.number (),
            "group_id": schema.number (),
        });

        let payload;
        try {
            payload = await request.validate ({ schema: userGroupSchema });
        } catch (e) {
            return response.badRequest ();
        }

        let user  = await User.find (payload['user_id']);
        let group = await Group.find (payload['group_id']);

        console.log(user, group)

        if (!user || !group) {
            return response.badRequest ();
        }

        try {
            await user.related ('userGroups').attach ([payload['group_id']]);
        } catch (e) {
            return response.internalServerError (e);
        }

        return response.ok ();
    }

    public async delete ({ auth, request, response }) {
        let currentUserId = auth.use ('web').user.id;

        let currentUser = await User.query ().where ('user_id', currentUserId).preload ('userGroups').first ();

        if (!currentUser) {
            return response.notFound ();
        }

        if (!(currentUser.hasAdminWrite ())) {
            return response.unauthorized ();
        }

        const groupId = request.headers ()[ 'group_id' ];
        const userId = request.headers ()[ 'user_id' ];

        const user  = await User.find (userId);
        const group = await Group.find (groupId);

        if (!user || !group) {
            return response.notFound ();
        }

        try {
            await Database.from('user_groups').delete().where('user_id', userId).where('group_id', groupId);
        } catch (e) {
            console.log(e)
            return response.internalServerError ();
        }

        return response.ok ();
    }
}
