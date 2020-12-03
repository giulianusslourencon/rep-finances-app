import { Transaction } from '@entities/Transaction'
import TransactionSchema from '@entities/schemas/Transaction'
import { ITransactionsRepository } from '@repositories/ITransactionsRepository'

export class MongoTransactionsRepository implements ITransactionsRepository {
  async list(skipLimit?: { skip: number; limit: number }): Promise<Transaction[]> {
    return await TransactionSchema.find({}, {}, { sort: { timestamp: -1 }, ...skipLimit }).lean()
  }

  async listByMonth(month: string, skipLimit?: { skip: number; limit: number }): Promise<Transaction[]> {
    return await TransactionSchema.find({month}, {}, skipLimit).lean()
  }

  async findById(id: string): Promise<Transaction | null | undefined> {
    return await TransactionSchema.findById(id).lean()
  }

  async save(transaction: Transaction): Promise<void> {
    await TransactionSchema.create(transaction)
  }

  async getNotRegisteredMonths(lastMonth: string): Promise<string[]> {
    const doc = await TransactionSchema.aggregate()
      .match({ month: { $gt: lastMonth } })
      .group({ _id: '$month' })
      .sort({ _id: 1 })
      .exec()

      return doc.map((month: { _id: string }) => month._id)
  }
}