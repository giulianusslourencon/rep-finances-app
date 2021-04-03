import { MongoTransactions, MongoBalance } from '@main/factories/external'
import { GetCurrentBalanceController } from '@presentation/controllers/Finances/implementations'

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
  return new GetCurrentBalanceController(useCase)
}
