import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Wallets extends BaseSchema {
  protected tableName = 'wallets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.decimal('balance').defaultTo(0).notNullable()
      table.string('account_number').notNullable()
      table.string('bank_code').notNullable()
      table.string('account_name').notNullable()
      table.string('user').unique().notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
       table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
