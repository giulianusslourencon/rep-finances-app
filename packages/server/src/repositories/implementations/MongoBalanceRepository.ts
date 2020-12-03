import { Balance } from '@entities/Balance'
import BalanceSchema, { BalanceAttributes } from '@entities/schemas/Balance'
import { IBalanceRepository } from '@repositories/IBalanceRepository'
import { ITransactionsRepository } from '@repositories/ITransactionsRepository'

export class MongoBalanceRepository implements IBalanceRepository {
  constructor (
    private transactionsRepository: ITransactionsRepository
  ) {}
  
  async setNotUpdatedFromMonth(month: string): Promise<void> {
    await BalanceSchema.updateMany(
      { _id: { $gte: month } }, 
      { $set: { updated: false } }
    )
  }

  async getCurrentBalance(): Promise<Balance> {
    const notUpdatedMonths = (await BalanceSchema.find(
      { updated: false }, 
      { _id: 1 }, 
      { sort: { _id: 1 } }
    ).lean()).map(balance => balance._id)

    const [lastBalance] = await BalanceSchema.find({},
      { _id: 1 },
      { sort: { _id: -1 }, limit: 1 }
    ).lean()

    const lastMonth: string = lastBalance ? lastBalance._id : '0'
    const notRegisteredMonths = await this.transactionsRepository.getNotRegisteredMonths(lastMonth)

    if (notUpdatedMonths.length > 0 || notRegisteredMonths.length > 0)
      this.updateBalance([...notUpdatedMonths, ...notRegisteredMonths])
    
    const [balance] = await BalanceSchema.find({}, 
      { individual_balance: 1 }, 
      { sort: { _id: -1 }, limit: 1 }
    ).lean()

    return balance || { individual_balance: {} }
  }

  private async updateBalance(
    notUpdatedMonths: string[]
  ): Promise<void> {
    let [lastUpdatedMonth] = await BalanceSchema.find(
      { updated: true }, {},
      { sort: { _id: -1 } }
    ).lean()
    lastUpdatedMonth ||= { _id: '', individual_balance: {}, updated: true }

    for (const month of notUpdatedMonths) {
      const transactions = await this.transactionsRepository.listByMonth(month)
      let { individual_balance: monthBalance } = new Balance([...transactions, lastUpdatedMonth])

      lastUpdatedMonth = await BalanceSchema.findByIdAndUpdate(
        month,
        { $set: { individual_balance: monthBalance, updated: true } },
        { upsert: true, new: true }
      ).lean() as BalanceAttributes
    }
  }
}