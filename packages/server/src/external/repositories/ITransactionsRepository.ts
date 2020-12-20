import { Transaction } from '@entities/Transaction'

import {
  TransactionCoreProps,
  TransactionProps,
  TransactionResumeProps
} from '@shared/types/Transaction'

export interface ITransactionsRepository {
  save(transaction: Transaction): Promise<void>

  list(skipLimit?: {
    skip: number
    limit: number
  }): Promise<TransactionResumeProps[]>
  listByMonth(
    month: string,
    skipLimit?: { skip: number; limit: number }
  ): Promise<TransactionResumeProps[]>

  count(): Promise<number>
  countByMonth(month: string): Promise<number>

  listItemsAndPayersByMonth(month: string): Promise<TransactionCoreProps[]>

  findById(id: string): Promise<TransactionProps | null | undefined>

  getNotRegisteredMonths(lastMonth: string): Promise<string[]>
}
