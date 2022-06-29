import BaseSeeder   from '@ioc:Adonis/Lucid/Seeder';
import Hash         from '@ioc:Adonis/Core/Hash';
import User         from 'App/Models/User';
import Group        from 'App/Models/Group';
import { DateTime } from 'luxon';

export default class UserSeeder extends BaseSeeder {
    public async run () {

        const password = await Hash.make ('su');

        let adminUser       = new User ();
        adminUser.password  = password;
        adminUser.email     = 'jackborrie@hotmail.com';
        adminUser.username  = 'jborrie_admin';
        adminUser.createdAt = DateTime.now ();
        adminUser.updatedAt = DateTime.now ();

        await adminUser.save ();

        let groups = await Group.all ();

        const adminGroupIds = groups.filter (group => {return group.name.includes ('admin');})
                                    .map (group => {return group.id;});

        await adminUser.related ('userGroups').attach (adminGroupIds);

        let basicUser       = new User ();
        basicUser.password  = password;
        basicUser.email     = 'jborrie@hotmail.com';
        basicUser.username  = 'jborrie_normal';
        basicUser.createdAt = DateTime.now ();
        basicUser.updatedAt = DateTime.now ();

        await basicUser.save ();

        let basicGroupIds = groups.filter (group => { return group.name.includes ('basic'); })
                                  .map (group => { return group.id; });

        await basicUser.related ('userGroups').attach (basicGroupIds);
    }
}
