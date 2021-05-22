import { Model } from 'mongoose'

import { transactions } from '@tests/__helpers__/solutions/mongodb/data'

import { TransactionDocument } from '@repositories/mongodb/models'

export class SetupTransactionsDatabase {
  constructor(private TransactionsModel: Model<TransactionDocument>) {}

  setupDB = async () => {
    await this.TransactionsModel.deleteMany()
    await this.TransactionsModel.insertMany(transactions)
  }
}
