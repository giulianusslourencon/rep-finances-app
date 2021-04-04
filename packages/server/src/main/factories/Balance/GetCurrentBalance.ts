import { MongoTransactions, MongoBalance } from '@main/factories/external'
import { GetCurrentBalanceControllerOperation } from '@presentation/controllers/Finances/operations'

import {
  UpdateRegisteredBalanceUseCase,
  GetCurrentBalanceUseCase
} from '@useCases/Finances/implementations'

export const makeGetCurrentBalance = () => {
  const updateBalance = new UpdateRegisteredBalanceUseCase(
    MongoTransactions,
    MongoBalance
  )
  const useCase = new GetCurrentBalanceUseCase(MongoBalance, updateBalance)
  return new GetCurrentBalanceControllerOperation(useCase)
}
