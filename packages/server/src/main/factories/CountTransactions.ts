import { MongoTransactions } from '@main/factories'
import { CountTransactionsController } from '@presentation/controllers/Transactions'

import { CountTransactionsUseCase } from '@useCases/Finances/implementations'

export const makeCountTransactions = () => {
  const useCase = new CountTransactionsUseCase(MongoTransactions)
  return new CountTransactionsController(useCase)
}
