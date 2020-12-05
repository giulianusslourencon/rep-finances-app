import { MongoBalanceRepository } from '@repositories/implementations/MongoBalanceRepository'
import { MongoTransactionsRepository } from '@repositories/implementations/MongoTransactionsRepository'

import { GetCurrentBalanceController } from './GetCurrentBalanceController'
import { GetCurrentBalanceUseCase } from './GetCurrentBalanceUseCase'

const transactionsRepository = new MongoTransactionsRepository()
const balanceRepository = new MongoBalanceRepository(transactionsRepository)

const getCurrentBalanceUseCase = new GetCurrentBalanceUseCase(balanceRepository)

const getCurrentBalanceController = new GetCurrentBalanceController(
  getCurrentBalanceUseCase
)

export { getCurrentBalanceUseCase, getCurrentBalanceController }
