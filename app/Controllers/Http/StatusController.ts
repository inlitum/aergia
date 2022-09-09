import User        from 'App/Models/User';
import UserStatus  from 'App/Models/UserStatus';
import Group       from 'App/Models/Group';
import SidebarItem from 'App/Models/SidebarItem';
import UserGroup   from 'App/Models/UserGroup';

export default class StatusController {

    public async status ({ auth, response }) {
        await auth.use ('web').authenticate ();

        const userId = auth.use('web').user.id;

        let user = await User.query().where('user_id', userId).preload('userGroups', (group) => {
            group.preload('group')
        }).first();

        if (!user) {
            return response.unauthorized();
        }

        let groups:string[] = [];

        user.userGroups.forEach(userGroup => {
            if (!userGroup || !userGroup.group) {
                return;
            }

            let prefix = userGroup.group.groupName;

            if (userGroup.read) {
                groups.push(prefix + '_read');
            }
            if (userGroup.write) {
                groups.push(prefix + '_write');
            }
        })

        let status = new UserStatus();
        status.groups = groups;
        status.sidebarItems = await this.getStructuredSidebar (user.userGroups)

        return status;
    }

    async getStructuredSidebar(userGroups: UserGroup[]): Promise<SidebarItem[]> {
        let items: SidebarItem[] = [];
        let parentGroups = await Group.query()
                                      .whereNull('parent_group_id')
                                      .orderBy('sidebar_weight');

        for (let group of parentGroups) {
            let item = await this.getGroupSidebarItem(group, userGroups);

            if (!item) continue;

            items.push(item);
        }

        return items;
    }

    async getGroupSidebarItem (group: Group, userGroups: UserGroup[]): Promise<SidebarItem | null> {
        let sidebarItem = await SidebarItem.query().where('group_id', group.id).first();

        if (!sidebarItem) return null;

        let childGroups = await Group.query().where('parent_group_id', group.id)
                                             .orderBy('sidebar_weight');

        if (childGroups && childGroups.length > 0) {
            sidebarItem.children = [];

            for (let child of childGroups) {{
                let item = await this.getGroupSidebarItem(child, userGroups);
                if (!item) continue;

                sidebarItem.children.push(item);
            }}
        }

        for (let userGroup of userGroups) {
            if (userGroup.group.groupName === 'admin' || userGroup.group.groupName === group.groupName) {
                return sidebarItem;
            }
        }

        return sidebarItem.children && sidebarItem.children.length > 0 ? sidebarItem : null;
    }





}
