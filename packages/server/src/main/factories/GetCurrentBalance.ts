import { MongoBalance, MongoTransactions } from '@main/factories'
import { GetCurrentBalanceController } from '@presentation/controllers/Balance'

import {
  GetCurrentBalanceUseCase,
  UpdateRegisteredBalanceUseCase
} from '@useCases/Balance/implementations'

export const makeGetCurrentBalance = () => {
  const updateBalance = new UpdateRegisteredBalanceUseCase(
    MongoTransactions,
    MongoBalance
  )
  const useCase = new GetCurrentBalanceUseCase(MongoBalance, updateBalance)
  return new GetCurrentBalanceController(useCase)
}
