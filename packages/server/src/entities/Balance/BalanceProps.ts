import { TransactionProps } from '@entities/Transaction'

export type IndividualBalanceProps = {
  [userId: string]: number
}

export type BalanceProps = {
  individual_balance: IndividualBalanceProps
}

export type TransactionCoreProps = Pick<TransactionProps, 'items' | 'payers'>
