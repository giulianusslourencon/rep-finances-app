import { Model } from 'mongoose'

import {
  balance,
  updatedBalance
} from '@tests/__helpers__/solutions/mongodb/data'

import { BalanceDocument } from '@repositories/mongodb/models'

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
