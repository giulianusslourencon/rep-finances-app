import { MongoTransactions, MongoBalance } from '@main/factories'
import { CreateTransactionController } from '@presentation/controllers/Transactions'

import { CreateTransactionUseCase } from '@useCases/implementations/Transactions'

export const makeCreateTransaction = () => {
  const useCase = new CreateTransactionUseCase(MongoTransactions, MongoBalance)
  return new CreateTransactionController(useCase)
}
