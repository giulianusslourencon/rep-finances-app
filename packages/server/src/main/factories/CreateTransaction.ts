import { MongoTransactions, MongoBalance } from '@main/factories'
import { CreateTransactionController } from '@presentation/controllers/Transactions'

import { CreateTransactionUseCase } from '@useCases/Finances/implementations'

export const makeCreateTransaction = () => {
  const useCase = new CreateTransactionUseCase(MongoTransactions, MongoBalance)
  return new CreateTransactionController(useCase)
}
