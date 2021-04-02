import { TransactionProps } from '@entities/Finances'

export type ItemsAndPayersList = Pick<TransactionProps, 'items' | 'payers'>[]

export interface UpdateRegisteredBalanceTransactionsRepository {
  listItemsAndPayersByMonth(month: string): Promise<ItemsAndPayersList>
  getNotRegisteredMonths(lastRegisteredMonth: string): Promise<string[]>
}
