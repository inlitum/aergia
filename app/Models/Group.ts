import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'

export default class Group extends BaseModel {
  @column({ isPrimary: true, columnName: "group_id" })
  public id: number

  @column()
  public groupName: string;

  @column()
  public parentGroupId: number;

  @hasOne(() => Group)
  public parentGroup: HasOne<typeof Group>
}
