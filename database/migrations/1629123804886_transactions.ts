import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Transactions extends BaseSchema {
  protected tableName = 'transactions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.decimal('balance_before').notNullable()
      table.decimal('balance_after').notNullable()
      table.string('reference').notNullable()
      table.string('wallet_id').notNullable()
      table.enum('type', ['CREDIT', 'DEBIT']).notNullable()
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
