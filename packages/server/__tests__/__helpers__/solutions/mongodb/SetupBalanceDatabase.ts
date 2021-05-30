import { balance, updatedBalance } from '@tests/solutions/mongodb/data'

import { BalanceModel } from '@repositories/mongodb/models'

export class SetupBalanceDatabase {
  setupDB = async () => {
    await BalanceModel.deleteMany()
    await BalanceModel.insertMany(balance)
  }

  setupDBUpdated = async () => {
    await BalanceModel.deleteMany()
    await BalanceModel.insertMany(updatedBalance)
  }
}
