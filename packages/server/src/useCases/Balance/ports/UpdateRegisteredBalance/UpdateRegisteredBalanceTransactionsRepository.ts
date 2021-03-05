import { TransactionProps } from '@entities/Transaction'

export type ItemsAndPayersList = Pick<TransactionProps, 'items' | 'payers'>[]

export interface UpdateRegisteredBalanceTransactionsRepository {
  listItemsAndPayersByMonth(month: string): Promise<ItemsAndPayersList>
  getNotRegisteredMonths(lastRegisteredMonth: string): Promise<string[]>
}
