import { MongoRepository } from '@repositories/mongodb/implementations'
import { BalanceModel } from '@repositories/mongodb/schemas'
import { IBalanceRepository, MonthBalance } from '@repositories/ports'

export class MongoBalanceRepository
  extends MongoRepository
  implements IBalanceRepository {
  collection = BalanceModel.name
  async erase(): Promise<void> {
    await BalanceModel.deleteMany()
  }

  async getMonthBalance(
    month: string
  ): Promise<MonthBalance | null | undefined> {
    return await BalanceModel.findById(month, { individual_balance: 1 }).lean()
  }

  async getNotUpdatedMonths(): Promise<string[]> {
    return await BalanceModel.find({ updated: false }, { _id: 1 })
      .lean()
      .map(document => document._id)
  }

  async updateMonth(month: string, balance: MonthBalance): Promise<void> {
    await BalanceModel.findByIdAndUpdate(month, {
      $set: { individual_balance: balance.individual_balance, updated: false }
    })
  }

  async setNotUpdatedFromMonth(month: string): Promise<void> {
    await BalanceModel.updateMany(
      { _id: { $gte: month } },
      { $set: { updated: false } }
    )
  }
}
