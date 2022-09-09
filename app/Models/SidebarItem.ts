import { column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm';
import BaseAergiaModel                              from 'App/Models/BaseAergiaModel';
import Group                                        from 'App/Models/Group';

export default class SidebarItem extends BaseAergiaModel {
    @column ({ isPrimary: true })
    public sidebarItemId: number;

    @column ()
    public type: 'link' | 'header' | 'text' | 'section';

    @column ()
    public text: string;

    @column ()
    public icon: string;

    @column ()
    public link: string;

    @column ()
    public color: string;

    @column ()
    public badge: string;

    @column ()
    public active: boolean;

    @column ()
    public groupId: number;

    @column()
    children: SidebarItem[];

    @hasOne (() => Group)
    group: HasOne<typeof Group>;
}
