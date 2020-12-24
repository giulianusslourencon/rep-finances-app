import { TransactionProps } from '@entities/Transaction'

export type TransactionsArrayViewModel = Pick<
  TransactionProps,
  '_id' | 'title' | 'timestamp' | 'amount' | 'related'
>[]
