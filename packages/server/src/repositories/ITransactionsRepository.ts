import { Transaction } from "@entities/Transaction"

export interface ITransactionsRepository {
  save(transaction: Transaction): Promise<void>
  findById(id: string): Promise<Transaction | null | undefined>
}