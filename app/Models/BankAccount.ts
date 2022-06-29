import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class BankAccount extends BaseModel {
  @column({ isPrimary: true })
  public bank_account_id: number

  @column ()
  public initial_balance: number;

  @column ()
  public account_name: string;

  @column ()
  public user_id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
