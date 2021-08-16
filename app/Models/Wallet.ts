import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'


export default class Wallet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public bank_code: string

  @column()
  public account_number: string

  @column()
  public account_name: string


  @column()
  public user: string

  @column()
  public balance: number

  @column()
  public transaction: string


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
