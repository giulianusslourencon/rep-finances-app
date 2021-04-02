import { Model } from 'mongoose'

import {
  BalanceDocument,
  TransactionDocument
} from '@repositories/mongodb/schemas'

import { balances, updatedBalances } from './balancesData'
import { transactions } from './transactionsData'

export class SetupFinancesDatabase {
  constructor(
    private TransactionsModel: Model<TransactionDocument>,
    private BalanceModel: Model<BalanceDocument>
  ) {}

  setupDB = async () => {
    await this.TransactionsModel.deleteMany()
    await this.BalanceModel.deleteMany()

    await this.TransactionsModel.insertMany(transactions)
    await this.BalanceModel.insertMany(balances)
  }

  setupDBUpdated = async () => {
    await this.TransactionsModel.deleteMany()
    await this.BalanceModel.deleteMany()

    await this.TransactionsModel.insertMany(transactions)
    await this.BalanceModel.insertMany(updatedBalances)
  }
}
