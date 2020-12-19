import { Transaction } from '@entities/Transaction'

import {
  ITransactionsRepository,
  TransactionList
} from '@repositories/ITransactionsRepository'
import TransactionSchema from '@repositories/mongodb/schemas/Transaction'

export class MongoTransactionsRepository implements ITransactionsRepository {
  async list(skipLimit?: {
    skip: number
    limit: number
  }): Promise<TransactionList> {
    return await TransactionSchema.find(
      {},
      { _id: 1, title: 1, timestamp: 1, amount: 1, related: 1 },
      { sort: { timestamp: -1 }, ...skipLimit }
    ).lean()
  }

  async listByMonth(
    month: string,
    skipLimit?: { skip: number; limit: number }
  ): Promise<TransactionList> {
    return await TransactionSchema.find(
      { month },
      { _id: 1, title: 1, timestamp: 1, amount: 1, related: 1 },
      { sort: { timestamp: -1 }, ...skipLimit }
    ).lean()
  }

  async count(): Promise<number> {
    return await TransactionSchema.count()
  }

  async countByMonth(month: string): Promise<number> {
    return await TransactionSchema.count({ month })
  }

  async listItemsAndPayersByMonth(
    month: string
  ): Promise<Pick<Transaction, 'items' | 'payers'>[]> {
    return await TransactionSchema.find(
      { month },
      { items: 1, payers: 1 }
    ).lean()
  }

  async findById(id: string): Promise<Transaction | null | undefined> {
    return await TransactionSchema.findById(id).lean()
  }

  async save(transaction: Transaction): Promise<void> {
    await TransactionSchema.create(transaction)
  }

  async getNotRegisteredMonths(lastMonth: string): Promise<string[]> {
    const doc = await TransactionSchema.aggregate<{ _id: string }>([
      { $match: { month: { $gt: lastMonth } } },
      { $group: { _id: '$month' } },
      { $sort: { _id: 1 } }
    ])

    return doc.map(month => month._id)
  }
}
