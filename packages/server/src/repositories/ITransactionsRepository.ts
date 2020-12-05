import { Transaction } from '@entities/Transaction'

export type TransactionList = Pick<
  Transaction,
  'title' | 'timestamp' | 'amount' | 'related'
>[]

export type TransactionCore = Pick<Transaction, 'items' | 'payers'>

export interface ITransactionsRepository {
  save(transaction: Transaction): Promise<void>
  list(skipLimit?: { skip: number; limit: number }): Promise<TransactionList>
  listByMonth(
    month: string,
    skipLimit?: { skip: number; limit: number }
  ): Promise<TransactionList>
  listItemsAndPayersByMonth(month: string): Promise<TransactionCore[]>
  findById(id: string): Promise<Transaction | null | undefined>
  getNotRegisteredMonths(lastMonth: string): Promise<string[]>
}
