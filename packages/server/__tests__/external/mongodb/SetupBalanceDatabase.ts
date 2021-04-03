import { Model } from 'mongoose'

import { balance, updatedBalance } from '@tests/external/mongodb/data'

import { BalanceDocument } from '@repositories/mongodb/schemas'

export class SetupBalanceDatabase {
  constructor(private BalanceModel: Model<BalanceDocument>) {}

  setupDB = async () => {
    await this.BalanceModel.deleteMany()
    await this.BalanceModel.insertMany(balance)
  }

  setupDBUpdated = async () => {
    await this.BalanceModel.deleteMany()
    await this.BalanceModel.insertMany(updatedBalance)
  }
}
