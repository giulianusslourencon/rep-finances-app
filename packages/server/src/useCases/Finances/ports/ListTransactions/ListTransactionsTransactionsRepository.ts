import { TransactionProps } from '@entities/Finances'

export type TransactionList = Pick<
  TransactionProps,
  '_id' | 'title' | 'date' | 'amount' | 'related'
>[]

export interface ListTransactionsTransactionsRepository {
  list(skipLimit?: { skip: number; limit: number }): Promise<TransactionList>
  listByMonth(
    month: string,
    skipLimit?: { skip: number; limit: number }
  ): Promise<TransactionList>
}
