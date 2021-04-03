import { MongoTransactions } from '@main/factories/external'
import { ListTransactionsController } from '@presentation/controllers/Finances/implementations'

import { ListTransactionsUseCase } from '@useCases/Finances/implementations'

export const makeListTransactions = () => {
  const useCase = new ListTransactionsUseCase(MongoTransactions)
  return new ListTransactionsController(useCase)
}
