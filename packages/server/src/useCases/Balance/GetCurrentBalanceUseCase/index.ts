import { MongoBalanceRepository } from '@repositories/mongodb/implementations/MongoBalanceRepository'
import { MongoTransactionsRepository } from '@repositories/mongodb/implementations/MongoTransactionsRepository'

import { GetCurrentBalanceController } from '../../../adapters/presentation/controllers/Balance/GetCurrentBalanceController'
import { GetCurrentBalanceUseCase } from './GetCurrentBalanceUseCase'

const transactionsRepository = new MongoTransactionsRepository()
const balanceRepository = new MongoBalanceRepository(transactionsRepository)

const getCurrentBalanceUseCase = new GetCurrentBalanceUseCase(balanceRepository)

const getCurrentBalanceController = new GetCurrentBalanceController(
  getCurrentBalanceUseCase
)

export { getCurrentBalanceUseCase, getCurrentBalanceController }
