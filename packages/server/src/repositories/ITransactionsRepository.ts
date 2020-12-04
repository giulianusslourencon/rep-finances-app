import { Transaction } from '@entities/Transaction'

export interface ITransactionsRepository {
  save(transaction: Transaction): Promise<void>
  list(skipLimit?: { skip: number, limit: number }): Promise<Pick<Transaction, 'title' | 'timestamp' | 'amount' | 'related'>[]>
  listByMonth(month: string, skipLimit?: { skip: number, limit: number }): Promise<Pick<Transaction, 'title' | 'timestamp' | 'amount' | 'related'>[]>
  listItemsAndPayersByMonth(month: string): Promise<Pick<Transaction, 'items' | 'payers'>[]>
  findById(id: string): Promise<Transaction | null | undefined>
  getNotRegisteredMonths(lastMonth: string): Promise<string[]>
}