import { MongoTransactions } from '@main/factories'
import { CountTransactionsController } from '@presentation/controllers/Transactions'

import { CountTransactionsUseCase } from '@useCases/implementations/Transactions'

export const makeCountTransactions = () => {
  const useCase = new CountTransactionsUseCase(MongoTransactions)
  return new CountTransactionsController(useCase)
}
