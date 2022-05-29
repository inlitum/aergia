import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Group      from 'App/Models/Group';

export default class GroupSeeder extends BaseSeeder {
    public async run () {
        await Group.createMany ([
            {
                name: 'admin_read',
            },
            {
                name: 'admin_write',
            },
            {
                name: 'basic_read',
            },
            {
                name: 'basic_write',
            },
        ]);
    }
}
