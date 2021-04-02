import { TransactionAttributes } from '@repositories/attributes'
import { MongoRepository } from '@repositories/mongodb/implementations'
import { TransactionModel } from '@repositories/mongodb/schemas'
import { ITransactionsRepository } from '@repositories/ports'

import { TransactionList } from '@useCases/Finances/ports/ListTransactions'
import { ItemsAndPayersList } from '@useCases/Finances/ports/UpdateRegisteredBalance'

export class MongoTransactionsRepository
  extends MongoRepository
  implements ITransactionsRepository {
  collection = TransactionModel.collection.name

  async clearCollection(): Promise<void> {
    await TransactionModel.deleteMany()
  }

  async list(skipLimit?: {
    skip: number
    limit: number
  }): Promise<TransactionList> {
    return await TransactionModel.find(
      {},
      { _id: 1, title: 1, date: 1, amount: 1, related: 1 },
      { sort: { date: -1 }, ...skipLimit }
    ).lean()
  }

  async listByMonth(
    month: string,
    skipLimit?: { skip: number; limit: number }
  ): Promise<TransactionList> {
    return await TransactionModel.find(
      { month },
      { _id: 1, title: 1, date: 1, amount: 1, related: 1 },
      { sort: { date: -1 }, ...skipLimit }
    ).lean()
  }

  async count(): Promise<number> {
    return await TransactionModel.countDocuments()
  }

  async countByMonth(month: string): Promise<number> {
    return await TransactionModel.countDocuments({ month })
  }

  async listItemsAndPayersByMonth(month: string): Promise<ItemsAndPayersList> {
    return await TransactionModel.find(
      { month },
      { _id: 0, items: 1, payers: 1 }
    ).lean()
  }

  async findById(
    id: string
  ): Promise<TransactionAttributes | null | undefined> {
    return await TransactionModel.findById(id).lean()
  }

  async save(transaction: TransactionAttributes): Promise<void> {
    await TransactionModel.create(transaction)
  }

  async getNotRegisteredMonths(lastRegisteredMonth: string): Promise<string[]> {
    const doc = await TransactionModel.aggregate<{ _id: string }>([
      { $match: { month: { $gt: lastRegisteredMonth } } },
      { $group: { _id: '$month' } },
      { $sort: { _id: 1 } }
    ])

    return doc.map(month => month._id)
  }
}
