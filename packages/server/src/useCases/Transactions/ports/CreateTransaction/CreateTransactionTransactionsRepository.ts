import { TransactionProps } from '@entities/Transaction'

export interface CreateTransactionTransactionsRepository {
  save(transaction: TransactionProps): Promise<void>
}
