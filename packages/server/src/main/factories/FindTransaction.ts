import { MongoTransactions } from '@main/factories'
import { FindTransactionController } from '@presentation/controllers/Transactions'

import { GetTransactionBalanceUseCase } from '@useCases/Balance/implementations'
import { FindTransactionUseCase } from '@useCases/Transactions/implementations'

export const makeFindTransaction = () => {
  const getTransactionBalance = new GetTransactionBalanceUseCase()
  const useCase = new FindTransactionUseCase(MongoTransactions)
  return new FindTransactionController(useCase, getTransactionBalance)
}
