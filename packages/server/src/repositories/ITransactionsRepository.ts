import { Transaction } from "@entities/Transaction"

export interface ITransactionsRepository {
  findById(id: string): Promise<Transaction | undefined>
  save(transaction: Transaction): Promise<void>
}