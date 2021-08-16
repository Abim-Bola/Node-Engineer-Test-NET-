import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Wallet from './Wallet'

export default class User extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column()
  public first_name: string

  @column()
  public password: string

  @column()
  public last_name: string

  @column()
  public email: string

  @belongsTo(() => Wallet, {
    foreignKey: 'user',
  })
  public branch: BelongsTo<typeof Wallet>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
