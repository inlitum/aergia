import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Group      from 'App/Models/Group';
import User       from 'App/Models/User';

export default class extends BaseSeeder {
    public async run () {

        const adminGroup = await Group.query().where( 'group_name', 'admin' ).first();

        const adminUser = await User.query().where( 'username', 'jborrie_admin' ).first();

        if ( !adminGroup || !adminUser ) {
            return;
        }

        await adminUser.related( 'groups' ).attach( {
                                                        [adminGroup.id]: {
                                                            read : false,
                                                            write: true,
                                                        },
                                                    } )

    }

}
