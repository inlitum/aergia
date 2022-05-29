// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Status from 'App/Models/Status';

export default class StatusController {

    public async status ({ auth }) {
        let loggedIn = true;

        try {
            await auth.use ('web').authenticate ();
        } catch (e) {
            loggedIn = false;
        }

        let statusResponse      = new Status ();
        statusResponse.loggedIn = loggedIn;

        return statusResponse.serialize ();
    }

}
