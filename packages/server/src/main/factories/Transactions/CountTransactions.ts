import { MongoTransactions } from '@main/factories/external'
import { CountTransactionsControllerOperation } from '@presentation/controllers/Finances/operations'

import { CountTransactionsUseCase } from '@useCases/Finances/implementations'

export const makeCountTransactions = (): CountTransactionsControllerOperation => {
  const useCase = new CountTransactionsUseCase(MongoTransactions)
  return new CountTransactionsControllerOperation(useCase)
}
