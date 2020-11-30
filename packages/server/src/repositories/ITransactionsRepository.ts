import { Transaction } from "@entities/Transaction"

export interface ITransactionsRepository {
  save(transaction: Transaction): Promise<void>
  list(skipLimit?: { skip: number, limit: number }): Promise<Transaction[]>
  findById(id: string): Promise<Transaction | null | undefined>
}