import BaseSeeder  from '@ioc:Adonis/Lucid/Seeder';
import Group       from 'App/Models/Group';
import SidebarItem from 'App/Models/SidebarItem';

export default class extends BaseSeeder {
    public async run () {
        // Generate groups.
        let adminGroup           = new Group ();
        adminGroup.groupName     = 'admin';
        adminGroup.creationUser  = 'seeder';
        adminGroup.updateUser    = 'seeder';
        adminGroup.sidebarWeight = 9000;

        let pagesGroup           = new Group ();
        pagesGroup.groupName     = 'page';
        pagesGroup.creationUser  = 'seeder';
        pagesGroup.updateUser    = 'seeder';
        pagesGroup.sidebarWeight = 1000;

        adminGroup = await adminGroup.save ();
        pagesGroup = await pagesGroup.save ();

        let usersGroup           = new Group ();
        usersGroup.parentGroupId = adminGroup.id;
        usersGroup.groupName     = 'user';
        usersGroup.creationUser  = 'seeder';
        usersGroup.updateUser    = 'seeder';
        usersGroup.sidebarWeight = 9100;

        let groupsGroup           = new Group ();
        groupsGroup.parentGroupId = adminGroup.id;
        groupsGroup.groupName     = 'group';
        groupsGroup.creationUser  = 'seeder';
        groupsGroup.updateUser    = 'seeder';
        groupsGroup.sidebarWeight = 9200;

        usersGroup  = await usersGroup.save ();
        groupsGroup = await groupsGroup.save ();

        let financeGroup           = new Group ();
        financeGroup.parentGroupId = pagesGroup.id;
        financeGroup.groupName     = 'finance';
        financeGroup.creationUser  = 'seeder';
        financeGroup.updateUser    = 'seeder';
        financeGroup.sidebarWeight   = 1100;

        financeGroup = await financeGroup.save();

        let accountGroup           = new Group ();
        accountGroup.parentGroupId = financeGroup.id;
        accountGroup.groupName     = 'account';
        accountGroup.creationUser  = 'seeder';
        accountGroup.updateUser    = 'seeder';
        accountGroup.sidebarWeight  = 1110;

        accountGroup = await accountGroup.save();
        // Generate Sidebar Item.

        let pagesSidebarItem           = new SidebarItem ();
        pagesSidebarItem.groupId = pagesGroup.id;
        pagesSidebarItem.text = 'pages';
        pagesSidebarItem.type = 'header';
        await pagesSidebarItem.save();

        let adminSidebarItem = new SidebarItem();
        adminSidebarItem.groupId = adminGroup.id;
        adminSidebarItem.text = 'admin pages';
        adminSidebarItem.type = 'header';
        await adminSidebarItem.save();

        let userSidebarItem = new SidebarItem();
        userSidebarItem.groupId = usersGroup.id;
        userSidebarItem.type = 'link';
        userSidebarItem.text = 'users';
        userSidebarItem.link = '/admin/users';
        userSidebarItem.color = '#CCEDE4';
        await userSidebarItem.save();

        let groupsSidebarItem = new SidebarItem();
        groupsSidebarItem.groupId = groupsGroup.id;
        groupsSidebarItem.type = 'link';
        groupsSidebarItem.text = 'groups';
        groupsSidebarItem.link = '/admin/groups';
        groupsSidebarItem.color = '#A6D2E1';
        await groupsSidebarItem.save();

        let financeSidebarItem = new SidebarItem();
        financeSidebarItem.groupId = financeGroup.id;
        financeSidebarItem.text = 'finance';
        financeSidebarItem.type = 'section';
        await financeSidebarItem.save();

        let accountsSidebarItem = new SidebarItem();
        accountsSidebarItem.groupId = accountGroup.id;
        accountsSidebarItem.type = 'link';
        accountsSidebarItem.text = 'accounts';
        accountsSidebarItem.link = '/finance/accounts';
        accountsSidebarItem.color = '#A8A6DB';
        await accountsSidebarItem.save();
        //#d3bae9
        //#f3d0f5
        //#ffe7f7


    }
}
