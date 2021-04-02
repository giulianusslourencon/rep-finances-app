import { TransactionProps } from '@entities/Finances'

export interface FindTransactionTransactionsRepository {
  findById(id: string): Promise<TransactionProps | null | undefined>
}
