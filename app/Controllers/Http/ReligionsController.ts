// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


import Religion     from 'App/Models/Religion';

export default class ReligionsController {

    public async index ({}) {
        return await Religion.all();
    }

    public async create () {
        let religion = new Religion();

        await religion.save();

        return religion;
    }

}
