import { MongoTransactions } from '@main/factories/external'
import { FindTransactionControllerOperation } from '@presentation/controllers/Finances/operations'

import {
  FindTransactionUseCase,
  GetTransactionBalanceUseCase
} from '@useCases/Finances/implementations'

export const makeFindTransaction = () => {
  const getTransactionBalance = new GetTransactionBalanceUseCase()
  const useCase = new FindTransactionUseCase(MongoTransactions)
  return new FindTransactionControllerOperation(useCase, getTransactionBalance)
}
