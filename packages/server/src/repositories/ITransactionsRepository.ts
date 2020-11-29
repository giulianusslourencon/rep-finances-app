import { Transaction } from "@entities/Transaction"

export interface ITransactionsRepository {
  findById(id: string): Promise<Transaction>
  save(transaction: Transaction): Promise<void>
}