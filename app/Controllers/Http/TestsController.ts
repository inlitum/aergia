// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { schema } from '@ioc:Adonis/Core/Validator';
import Test       from 'App/Models/Test';

export default class TestsController {

    public async index ({}) {
        return await Test.all();
    }

    public async create ({request}) {

        const testSchema = schema.create ({
            name: schema.string ()
        });

        let payload = await request.validate ({ schema: testSchema });

        let test = new Test();
        test.name = payload.name;

        await test.save();

        return test;
    }

}
