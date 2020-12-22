import { MongoTransactionsRepository } from '@repositories/mongodb/implementations/MongoTransactionsRepository'

import { getTransactionBalanceUseCase } from '@useCases/Balance/GetTransactionBalanceUseCase'

import { FindTransactionController } from '../../../adapters/presentation/controllers/Transactions/FindTransactionController'
import { FindTransactionUseCase } from './FindTransactionUseCase'

const mongoTransactionRepository = new MongoTransactionsRepository()

const findTransactionUseCase = new FindTransactionUseCase(
  mongoTransactionRepository
)

const findTransactionController = new FindTransactionController(
  findTransactionUseCase,
  getTransactionBalanceUseCase
)

export { findTransactionUseCase, findTransactionController }
