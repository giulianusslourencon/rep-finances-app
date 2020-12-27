import { TransactionProps } from '@entities/Transaction'

import { UseCase } from '@useCases/contracts'

export type ListTransactionsProps = {
  skipLimit?: {
    skip: number
    limit: number
  }
  month?: string
}

export type ListTransactionsResponse = Pick<
  TransactionProps,
  '_id' | 'amount' | 'related' | 'date' | 'title'
>[]

export type ListTransactions = UseCase<
  ListTransactionsProps,
  Promise<ListTransactionsResponse>
>
