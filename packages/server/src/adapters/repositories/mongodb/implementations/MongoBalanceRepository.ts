import { MonthBalance } from '@repositories/attributes'
import { MongoRepository } from '@repositories/mongodb/implementations'
import { BalanceModel } from '@repositories/mongodb/schemas'

import { GetCurrentBalanceBalanceRepository } from '@useCases/Balance/ports/GetCurrentBalance'
import { UpdateRegisteredBalanceBalanceRepository } from '@useCases/Balance/ports/UpdateRegisteredBalance'
import { CreateTransactionBalanceRepository } from '@useCases/Transactions/ports/CreateTransaction'

export class MongoBalanceRepository
  extends MongoRepository
  implements
    GetCurrentBalanceBalanceRepository,
    UpdateRegisteredBalanceBalanceRepository,
    CreateTransactionBalanceRepository {
  collection = BalanceModel.collection.name

  async clearCollection(): Promise<void> {
    await BalanceModel.deleteMany()
  }

  async getMonthBalance(
    month: string
  ): Promise<MonthBalance | null | undefined> {
    return await BalanceModel.findById(month, {
      _id: 0,
      individual_balance: 1
    }).lean()
  }

  async getNotUpdatedMonths(): Promise<string[]> {
    const docs = await BalanceModel.find(
      { updated: false },
      { _id: 1 },
      { sort: { _id: 1 } }
    ).lean()

    return docs.map(document => document._id)
  }

  async getLastRegisteredMonth(): Promise<string | null | undefined> {
    const lastRegisteredMonth = await BalanceModel.findOne(
      {},
      { _id: 1 },
      { sort: { _id: -1 } }
    ).lean()

    return lastRegisteredMonth ? lastRegisteredMonth._id : lastRegisteredMonth
  }

  async getLastUpdatedMonth(): Promise<string | null | undefined> {
    const lastUpdatedMonth = await BalanceModel.findOne(
      { updated: true },
      { _id: 1 },
      { sort: { _id: -1 } }
    ).lean()

    return lastUpdatedMonth ? lastUpdatedMonth._id : lastUpdatedMonth
  }

  async updateMonth(month: string, balance: MonthBalance): Promise<void> {
    await BalanceModel.findByIdAndUpdate(
      month,
      {
        $set: { individual_balance: balance.individual_balance, updated: true }
      },
      { upsert: true }
    )
  }

  async setNotUpdatedFromMonth(month: string): Promise<void> {
    await BalanceModel.updateMany(
      { _id: { $gte: month } },
      { $set: { updated: false } }
    )
  }
}
