import { TransactionProps } from '@entities/Finances'

export interface CreateTransactionTransactionsRepository {
  save(transaction: TransactionProps): Promise<void>
}
