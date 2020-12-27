import { TransactionViewModel } from '@presentation/viewModels'

export type CreateTransactionViewModel = Pick<
  TransactionViewModel,
  'title' | 'timestamp' | 'items' | 'payers'
>
