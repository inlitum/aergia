// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Logger            from '@ioc:Adonis/Core/Logger';
import getCurrentUser    from 'App/Controllers/Http/Shared';
import Tag               from 'App/Models/Tag';
import { rules, schema } from '@ioc:Adonis/Core/Validator';

export default class TagsController {

    tagsController = Logger.child ({ name: 'TagsController' });

    public async index ({ auth, request, response }) {
        const userId = await auth.use ('web').user.id;

        if (!userId) {
            this.tagsController.warn ('TODO');
            return response.unauthorized ();
        }

        let user = await getCurrentUser (userId);

        if (!user) {
            this.tagsController.warn ('TODO');
            return response.unauthorized ();
        }

        if (!user.hasAdminRead () && !user.hasReadGroup ('accounts')) {
            this.tagsController.warn ('TODO');
            return response.unauthorized ();
        }

        let page           = request.header ('page') || 1;
        let perPage        = request.header ('perPage') || 10;
        let orderBy        = request.header ('orderBy') || 'tag_name';
        let orderDirection = request.header ('orderDirection') || 'asc';

        return await Tag.query ()
        .orderBy (orderBy, orderDirection)
        .paginate (page, perPage);
    }

    public async read ({ auth, request, response }) {
        const userId = await auth.use ('web').user.id;
        const tagId  = request.param ('id');

        if (!userId) {
            this.tagsController.warn ('TODO');
            return response.unauthorized ();
        }

        let user = await getCurrentUser (userId);

        if (!user) {
            this.tagsController.warn ('TODO');
            return response.unauthorized ();
        }

        if (!user.hasAdminRead () && !user.hasReadGroup ('accounts')) {
            this.tagsController.warn ('TODO');
            return response.unauthorized ();
        }

        if (!tagId) {
            this.tagsController.warn ('TODO');
            return response.notFound ();
        }

        const tag = await Tag.query ()
        .where ('tag_id', tagId)
        .preload('users')
        .first ();

        if (!tag) {
            this.tagsController.warn ('TODO');
            return response.notFound ();
        }

        return tag;
    }

    public async create ({ auth, request, response }) {
        const userId = await auth.use ('web').user.id;

        if (!userId) {
            this.tagsController.warn ('TODO');
            return response.unauthorized ();
        }

        let user = await getCurrentUser (userId);

        if (!user) {
            this.tagsController.warn ('TODO');
            return response.unauthorized ();
        }

        if (!user.hasAdminWrite () && !user.hasWriteGroup ('accounts')) {
            this.tagsController.warn ('TODO');
            return response.unauthorized ();
        }

        const tagSchema = schema.create ({
            tag_name: schema.string ({ trim: true }, [ rules.minLength (3), rules.maxLength (255) ])
        });

        let payload;
        try {
            payload = await request.validate ({ schema: tagSchema });
        } catch (e) {
            this.tagsController.warn ('TODO');
            return response.badRequest (e);
        }

        let tag          = new Tag ();
        tag.tagName      = payload.tag_name;
        tag.creationUser = user.username;
        tag.updateUser   = user.username;
        try {
            await tag.save ();
        } catch (e) {
            this.tagsController.warn ('TODO');
            return response.internalServerError (e);
        }

        return tag;
    }

    public async update ({ auth, request, response }) {
        const userId    = await auth.use ('web').user.id;
        const tagId     = request.param ('id');

        if (!userId) {
            this.tagsController.warn ('TODO');
            return response.unauthorized ();
        }

        let user = await getCurrentUser (userId);

        if (!user) {
            this.tagsController.warn ('TODO');
            return response.unauthorized ();
        }

        if (!user.hasAdminWrite () && !user.hasWriteGroup ('accounts')) {
            this.tagsController.warn ('TODO');
            return response.unauthorized ();
        }

        let tag = await Tag.query ().where ('tag_id', tagId).first ();

        if (tag == null) {
            this.tagsController.warn ('TODO');
            return response.notFound ();
        }

        const tagSchema = schema.create ({
            tag_name: schema.string ({ trim: true }, [ rules.minLength (5), rules.maxLength (255) ])
        });

        let payload;
        try {
            payload = await request.validate ({ schema: tagSchema });
        } catch (e) {
            this.tagsController.warn ('TODO');
            return response.badRequest (e);
        }

        tag.tagName      = payload.tag_name;
        tag.updateUser   = user.username;

        try {
            await tag.save ();
        } catch (e) {
            this.tagsController.warn ('TODO');
            return response.internalServerError (e);
        }

        return tag;
    }

    public async delete ({ auth, request, response }) {
        const userId    = await auth.use ('web').user.id;
        const tagId     = request.param ('id');

        if (!userId) {
            this.tagsController.warn ('TODO');
            return response.unauthorized ();
        }

        let user = await getCurrentUser (userId);

        if (!user) {
            this.tagsController.warn ('TODO');
            return response.unauthorized ();
        }

        if (!user.hasAdminWrite () && !user.hasWriteGroup ('accounts')) {
            this.tagsController.warn ('TODO');
            return response.unauthorized ();
        }

        let tag = await Tag.query ().where ('tag_id', tagId).first ();

        if (tag == null) {
            this.tagsController.warn ('TODO');
            return response.notFound ();
        }

        try {
            await tag.delete ();
            return response.ok ();
        } catch (e) {
            this.tagsController.warn ('TODO');
            return response.internalServerError (e);
        }
    }
}
