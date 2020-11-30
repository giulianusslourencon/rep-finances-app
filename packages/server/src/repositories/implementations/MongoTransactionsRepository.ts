import { Transaction } from '@entities/Transaction'
import TransactionSchema from '@entities/schemas/Transaction'
import { ITransactionsRepository } from '@repositories/ITransactionsRepository'

export class MongoTransactionsRepository implements ITransactionsRepository {
  async list(skipLimit?: { skip: number; limit: number }): Promise<Transaction[]> {
    return await TransactionSchema.find({}, {}, skipLimit).lean()
  }

  async findById(id: string): Promise<Transaction | null | undefined> {
    return await TransactionSchema.findById(id).lean()
  }

  async save(transaction: Transaction): Promise<void> {
    await TransactionSchema.create(transaction)
  }
}