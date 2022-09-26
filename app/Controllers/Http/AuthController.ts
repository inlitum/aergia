// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User              from 'App/Models/User';
import Hash              from '@ioc:Adonis/Core/Hash';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import Logger from "@ioc:Adonis/Core/Logger";

export default class AuthController {

    authController = Logger.child ({ name: 'AuthenticationController' });

    public async login ( { auth, request, response } ) {
        let body = request.body();

        const email      = body.email;
        const password   = body.password;
        const rememberMe = body['remember_me'] ?? false;

        if ( !email || !password ) {
            return response.badRequest();
        }

        const user = await User.query().where( 'email', email ).firstOrFail();

        let validPassword = false;
        try {
            validPassword = await Hash.verify( user.password, password );
        } catch (e) {
            this.authController.error('Test');
            return response.internalServerError(e);
        }

        if ( !validPassword ) {
            return response.badRequest( 'Invalid credentials' );
        }

        // await user.load ('userGroups');

        return await auth.use ('web').login (user, rememberMe);
    }

    public async register ( { auth, request, response } ) {
        const registrationScheme = schema.create( {
                                                      username: schema.string( {}, [
                                                          rules.minLength( 6 ),
                                                          rules.unique( { table: 'users', column: 'username' } ),
                                                      ] ),
                                                      email   : schema.string( {}, [ rules.email(), rules.unique( {
                                                                                                                      table : 'users',
                                                                                                                      column: 'email',
                                                                                                                  } ) ] ),
                                                      password: schema.string( {}, [] ),
                                                  } );

        let payload;
        try {
            payload = await request.validate( {
                                                  schema: registrationScheme,
                                              } );
        } catch ( e ) {
            return response.badRequest( e );
        }

        let password = await Hash.make( payload.password );

        const user    = new User();
        user.email    = payload.email;
        user.username = payload.username;
        user.password = password;

        try {
            await user.save();
        } catch {
            return response.internalServerError();
        }

        return await auth.use( 'web' ).login( user );
    }

    public async logout ( { auth, response } ) {
        await auth.use('web').authenticate();

        let userId = auth.use('web').user.id;

        if (userId == null) {
            return response.unauthorized();
        }

        return await auth.logout ();
    }

    async sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time))
    }
}
