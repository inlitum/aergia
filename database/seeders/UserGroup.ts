import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Group      from 'App/Models/Group';
import User       from 'App/Models/User';
import UserGroup  from 'App/Models/UserGroup';

export default class extends BaseSeeder {
    public async run () {

        const adminGroup = await Group.query().where( 'group_name', 'admin' ).first();

        const adminUser = await User.query().where( 'username', 'jborrie_admin' ).first();

        if ( !adminGroup || !adminUser ) {
            return;
        }

        let userGroup          = new UserGroup()
        userGroup.groupId      = adminGroup.id;
        userGroup.userId       = adminUser.id;
        userGroup.read         = true;
        userGroup.write        = true;
        userGroup.creationUser = 'seeder';
        userGroup.updateUser   = 'seeder';

        await userGroup.save();

    }

}
