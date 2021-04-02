import { transactions } from '@tests/mongodb/data'
import { Model } from 'mongoose'

import { TransactionDocument } from '@repositories/mongodb/schemas'

export class SetupTransactionsDatabase {
  constructor(private TransactionsModel: Model<TransactionDocument>) {}

  setupDB = async () => {
    await this.TransactionsModel.deleteMany()
    await this.TransactionsModel.insertMany(transactions)
  }
}
