// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User                      from 'App/Models/User';
import { hasGroup as _hasGroup } from 'App/Shared/shared';

export default class UsersController {
    public async index ({ auth, request, response }) {
        let userId = auth.use ('api').user.id;

        let user = await User.query ().where ('user_id', userId).preload ('userGroups').first ();

        if (!user) {
            return response.notFound ();
        }

        if (!_hasGroup (user.userGroups, ['admin_read', 'admin_write'])) {
            return response.unauthorized ();
        }

        // Boring old pagination stuff.
        let offset         = request.header ('offset') || 1;
        let perPage        = request.header ('perPage') || 10;
        let orderBy        = request.header ('orderBy') || 'name';
        let orderDirection = request.header ('orderDirection') || 'asc';

        return await User.query ()
                         .preload ('userGroups')
                         .orderBy (orderBy, orderDirection)
                         .paginate (offset, perPage);
    }
}
