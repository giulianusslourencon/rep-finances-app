import { MongoTransactions } from '@main/factories/external'
import { CountTransactionsController } from '@presentation/controllers/Finances/implementations'

import { CountTransactionsUseCase } from '@useCases/Finances/implementations'

export const makeCountTransactions = () => {
  const useCase = new CountTransactionsUseCase(MongoTransactions)
  return new CountTransactionsController(useCase)
}
