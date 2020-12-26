import { MongoTransactions } from '@main/factories'
import { FindTransactionController } from '@presentation/controllers/Transactions'

import { GetTransactionBalanceUseCase } from '@useCases/implementations/Balance'
import { FindTransactionUseCase } from '@useCases/implementations/Transactions'

export const makeFindTransaction = () => {
  const getTransactionBalance = new GetTransactionBalanceUseCase()
  const useCase = new FindTransactionUseCase(MongoTransactions)
  return new FindTransactionController(useCase, getTransactionBalance)
}
