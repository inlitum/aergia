// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User              from 'App/Models/User';
import Hash              from '@ioc:Adonis/Core/Hash';
import { rules, schema } from '@ioc:Adonis/Core/Validator';

export default class AuthController {
    public async login ({ auth, request, response }) {
        let body = request.body ();

        const email      = body.email;
        const password   = body.password;
        const rememberMe = body[ 'remember_me' ] ?? false;

        if (!email || !password) {
            return response.badRequest ();
        }

        const user = await User.query ().where ('email', email).firstOrFail ();

        if (!(await Hash.verify (user.password, password))) {
            return response.badRequest ('Invalid credentials');
        }

        // await user.load ('userGroups');

        return await auth.use ('web').login (user, rememberMe);
    }

    public async register ({ auth, request, response }) {
        const registrationScheme = schema.create ({
            username: schema.string ({}, [
                rules.minLength (6),
                rules.unique ({ table: 'users', column: 'username' }),
            ]),
            email:    schema.string ({}, [rules.email (), rules.unique ({ table: 'users', column: 'email' })]),
            password: schema.string ({}, []),
        });

        let payload;
        try {
            payload = await request.validate ({
                schema: registrationScheme,
            });
        } catch (e) {
            return response.badRequest (e);
        }

        let password = await Hash.make (payload.password);

        const user    = new User ();
        user.email    = payload.email;
        user.username = payload.username;
        user.password = password;

        try {
            await user.save ();
        } catch {
            return response.internalServerError ();
        }

        // let basicGroupIds = (await Group.all ()).filter (group => group.name.includes ('basic'))
        //                                         .map (group => group.id);

        // await user.related ('userGroups').attach (basicGroupIds);
        //
        // await user.load ('userGroups');

        return await auth.use ('web').login (user);
    }
}
