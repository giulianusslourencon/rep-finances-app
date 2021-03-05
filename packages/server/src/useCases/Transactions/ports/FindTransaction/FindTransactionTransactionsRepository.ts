import { TransactionProps } from '@entities/Transaction'

export interface FindTransactionTransactionsRepository {
  findById(id: string): Promise<TransactionProps | null | undefined>
}
