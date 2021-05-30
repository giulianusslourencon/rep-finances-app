import { transactions } from '@tests/solutions/mongodb/data'

import { TransactionModel } from '@repositories/mongodb/models'

export class SetupTransactionsDatabase {
  setupDB = async () => {
    await TransactionModel.deleteMany()
    await TransactionModel.insertMany(transactions)
  }
}
