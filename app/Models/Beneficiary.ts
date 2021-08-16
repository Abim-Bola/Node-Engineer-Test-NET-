import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Beneficiary extends BaseModel {
  @column({ isPrimary: true })
  public id: number
@column()
  public account_name: string

  @column()
  public account_number: string

  @column()
  public user_id: number

  @column()
  public bank_code: string
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
