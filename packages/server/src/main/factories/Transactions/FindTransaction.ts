import { MongoTransactions } from '@main/factories/external'
import { FindTransactionController } from '@presentation/controllers/Finances/implementations'

import {
  FindTransactionUseCase,
  GetTransactionBalanceUseCase
} from '@useCases/Finances/implementations'

export const makeFindTransaction = () => {
  const getTransactionBalance = new GetTransactionBalanceUseCase()
  const useCase = new FindTransactionUseCase(MongoTransactions)
  return new FindTransactionController(useCase, getTransactionBalance)
}
