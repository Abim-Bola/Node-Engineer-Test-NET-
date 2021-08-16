import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Wallets extends BaseSchema {
  protected tableName = 'wallets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.json('transactions').nullable()
      table.text('balance').defaultTo(0).notNullable()
      table.string('account_number').notNullable()
      table.string('bank_code').notNullable()
      table.string('account_name').notNullable()
      table.string('user').unique().notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
