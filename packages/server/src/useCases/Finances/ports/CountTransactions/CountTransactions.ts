import { UseCase } from '@useCases/contracts'

export type CountTransactionsProps = {
  month?: string
}

export type CountTransactionsResponse = number

export type CountTransactions = UseCase<
  CountTransactionsProps,
  Promise<CountTransactionsResponse>
>
