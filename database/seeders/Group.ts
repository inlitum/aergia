import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Group      from "App/Models/Group";

export default class extends BaseSeeder {
  public async run() {

    let adminGroup       = new Group();
    adminGroup.groupName = "admin"

    let accountGroup       = new Group();
    accountGroup.groupName = "accounts";

    await adminGroup.save();
  }
}
