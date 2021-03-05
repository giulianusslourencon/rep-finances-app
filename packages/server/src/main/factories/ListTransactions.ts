import { MongoTransactions } from '@main/factories'
import { ListTransactionsController } from '@presentation/controllers/Transactions'

import { ListTransactionsUseCase } from '@useCases/Transactions/implementations'

export const makeListTransactions = () => {
  const useCase = new ListTransactionsUseCase(MongoTransactions)
  return new ListTransactionsController(useCase)
}
