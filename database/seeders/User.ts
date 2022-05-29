import BaseSeeder   from '@ioc:Adonis/Lucid/Seeder';
import Hash         from '@ioc:Adonis/Core/Hash';
import User         from 'App/Models/User';
import Group        from 'App/Models/Group';
import { DateTime } from 'luxon';

export default class UserSeeder extends BaseSeeder {
    public async run () {

        const password = await Hash.make ('su');

        let user       = new User ();
        user.password  = password;
        user.email     = 'jackborrie@hotmail.com';
        user.username  = 'jborrie';
        user.createdAt = DateTime.now ();
        user.updatedAt = DateTime.now ();

        await user.save ();

        let groups = await Group.all ();

        const groupIds = groups.filter (group => {return group.name.includes ('admin');})
                               .map (group => {return group.id;});

        await user.related ('userGroups').attach (groupIds);

    }
}
