import { Balance } from '@entities/Balance'
import { DomainError } from '@entities/errors'

import BalanceSchema, {
  BalanceAttributes
} from '@repositories/mongodb/schemas/Balance'
import { IBalanceRepository } from '@repositories/ports/IBalanceRepository'
import { ITransactionsRepository } from '@repositories/ports/ITransactionsRepository'

import { BalanceProps } from '@shared/@types/Balance'
import { Either, left, right } from '@shared/Either'

export class MongoBalanceRepository implements IBalanceRepository {
  // eslint-disable-next-line prettier/prettier
  constructor(private transactionsRepository: ITransactionsRepository) { }

  async setNotUpdatedFromMonth(month: string): Promise<void> {
    await BalanceSchema.updateMany(
      { _id: { $gte: month } },
      { $set: { updated: false } }
    )
  }

  async getCurrentBalance(): Promise<BalanceProps> {
    const notUpdatedMonths = (
      await BalanceSchema.find(
        { updated: false },
        { _id: 1 },
        { sort: { _id: 1 } }
      ).lean()
    ).map(balance => balance._id)

    const [lastBalance] = await BalanceSchema.find(
      {},
      { _id: 1 },
      { sort: { _id: -1 }, limit: 1 }
    ).lean()

    const lastMonth: string = lastBalance ? lastBalance._id : '0'
    const notRegisteredMonths = await this.transactionsRepository.getNotRegisteredMonths(
      lastMonth
    )

    if (notUpdatedMonths.length + notRegisteredMonths.length > 0)
      await this.updateBalance([...notUpdatedMonths, ...notRegisteredMonths])

    const [balance] = await BalanceSchema.find(
      {},
      { individual_balance: 1 },
      { sort: { _id: -1 }, limit: 1 }
    ).lean()

    return balance || { individual_balance: {} }
  }

  private async updateBalance(
    notUpdatedMonths: string[]
  ): Promise<Either<DomainError & Error, null>> {
    let [lastUpdatedMonth] = (await BalanceSchema.find(
      { updated: true },
      {},
      { sort: { _id: -1 } }
    ).lean()) as BalanceAttributes[]
    lastUpdatedMonth = lastUpdatedMonth || {
      _id: '',
      individual_balance: {},
      updated: true
    }

    for (const month of notUpdatedMonths) {
      const transactions = await this.transactionsRepository.listItemsAndPayersByMonth(
        month
      )
      const { individual_balance } = lastUpdatedMonth

      const balanceOrError = Balance.create([
        ...transactions,
        { individual_balance }
      ])
      if (balanceOrError.isLeft()) return left(balanceOrError.value)
      const { individual_balance: monthBalance } = balanceOrError.value

      lastUpdatedMonth = (await BalanceSchema.findByIdAndUpdate(
        month,
        { $set: { individual_balance: monthBalance.value, updated: true } },
        { upsert: true, new: true }
      ).lean()) as BalanceAttributes
    }

    return right(null)
  }
}
