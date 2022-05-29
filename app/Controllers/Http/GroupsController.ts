// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User         from 'App/Models/User';
import Group        from 'App/Models/Group';
import { schema }   from '@ioc:Adonis/Core/Validator';
import { DateTime } from 'luxon';

export default class GroupsController {

    public async index ({ auth, request, response }) {
        let userId = auth.use ('web').user.id;

        const user = await User.query ().where ('user_id', userId).preload ('userGroups').first ();

        if (!user || !(await user.hasAdminRead ())) {
            return response.unauthorized ();
        }

        // Boring old pagination stuff.
        let page           = request.header ('page') || 1;
        let perPage        = request.header ('perPage') || 10;
        let orderBy        = request.header ('orderBy') || 'name';
        let orderDirection = request.header ('orderDirection') || 'asc';

        return await Group.query ()
                          .orderBy (orderBy, orderDirection)
                          .paginate (page, perPage);
    }

    public async create ({ auth, request, response }) {
        let userId = auth.use ('web').user.id;

        const user = await User.query ().where ('user_id', userId).preload ('userGroups').first ();

        if (!user || !(await user.hasAdminWrite ())) {
            return response.unauthorized ();
        }

        const groupSchema = schema.create ({
            name: schema.string (),
        });

        let payload;
        try {
            payload = await request.validate ({ schema: groupSchema });
        } catch (e) {
            return response.badRequest (e);
        }

        const group     = new Group ();
        group.name      = payload.name;
        group.createdAt = DateTime.now ();
        group.updatedAt = DateTime.now ();

        try {
            await group.save ();
        } catch (e) {
            return response.internalServerError (e);
        }

        return group;
    }

    public async read ({ auth, request, response }) {

        let userId = auth.use ('web').user.id;

        const user = await User.query ().where ('user_id', userId).preload ('userGroups').first ();

        if (!user || !(await user.hasAdminRead ())) {
            return response.unauthorized ();
        }

        let groupId = request.params ().id;

        let group = await Group.query ().where ('group_id', groupId).first ();

        if (!group) {
            return response.notFound ();
        }

        return group;
    }

    public async update ({ auth, request, response }) {

        let userId = auth.use ('web').user.id;

        const user = await User.query ().where ('user_id', userId).preload ('userGroups').first ();

        if (!user || !(await user.hasAdminWrite ())) {
            return response.unauthorized ();
        }

        let groupId = request.params ().id;

        let group = await Group.find (groupId);

        if (!group) {
            return response.notFound ();
        }

        const groupSchema = schema.create ({
            name: schema.string (),
        });

        let payload;
        try {
            payload = await request.validate ({ schema: groupSchema });
        } catch (e) {
            return response.badRequest (e);
        }

        group.name      = payload.name;
        group.updatedAt = DateTime.now ();

        try {
            await group.save ();
        } catch (e) {
            return response.internalServerError (e);
        }

        return group;
    }

    public async delete ({ auth, request, response }) {

        let userId = auth.use ('web').user.id;

        const user = await User.query ().where ('user_id', userId).preload ('userGroups').first ();

        if (!user || !(await user.hasAdminWrite ())) {
            return response.unauthorized ();
        }

        let groupId = request.params ().id;

        let group = await Group.find (groupId);

        if (!group) {
            return response.notFound ();
        }

        try {
            await group.delete ();
        } catch (e) {
            return response.internalServerError (e);
        }

        return group;
    }

}
