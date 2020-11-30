import { Transaction } from '@entities/Transaction'
import TransactionSchema from '@entities/schemas/Transaction'
import { ITransactionsRepository } from '@repositories/ITransactionsRepository'

export class MongoTransactionsRepository implements ITransactionsRepository {
  async findById(id: string): Promise<Transaction | null | undefined> {
    return await TransactionSchema.findById(id).lean()
  }

  async save(transaction: Transaction): Promise<void> {
    await TransactionSchema.create(transaction)
  }
}