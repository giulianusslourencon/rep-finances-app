import { MongoTransactions } from '@main/factories/external'
import { ListTransactionsControllerOperation } from '@presentation/controllers/Finances/operations'

import { ListTransactionsUseCase } from '@useCases/Finances/implementations'

export const makeListTransactions = (): ListTransactionsControllerOperation => {
  const useCase = new ListTransactionsUseCase(MongoTransactions)
  return new ListTransactionsControllerOperation(useCase)
}
