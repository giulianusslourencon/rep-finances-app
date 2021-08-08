import { TransactionProps } from '@entities/Finances'

export type TransactionCoreProps = Pick<TransactionProps, 'items' | 'payers'>
