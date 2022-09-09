import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';
import SidebarItem from './SidebarItem';

export default class UserStatus extends BaseModel {
    @column()
    public groups: string[];

    @column()
    public sidebarItems: SidebarItem[];
}