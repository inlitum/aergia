import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Hash       from '@ioc:Adonis/Core/Hash';
import User       from 'App/Models/User';

export default class UserSeeder extends BaseSeeder {
    public async run() {

        const password = await Hash.make( 'su' );

        let adminUser          = new User();
        adminUser.password     = password;
        adminUser.email        = 'jackborrie@hotmail.com';
        adminUser.username     = 'jborrie_admin';
        adminUser.creationUser = "seeder";
        adminUser.updateUser   = "seeder";

        await adminUser.save();

        let normalUser          = new User();
        normalUser.password     = password;
        normalUser.email        = 'notfake@hotmail.com';
        normalUser.username     = 'jborrie_normal';
        normalUser.creationUser = "seeder";
        normalUser.updateUser   = "seeder";

        await normalUser.save();
    }
}
