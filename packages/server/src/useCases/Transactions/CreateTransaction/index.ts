import { MongoBalanceRepository } from '@repositories/implementations/MongoBalanceRepository'
import { MongoTransactionsRepository } from '@repositories/implementations/MongoTransactionsRepository'

import { CreateTransactionController } from './CreateTransactionController'
import { CreateTransactionUseCase } from './CreateTransactionUseCase'
import { CreateTransactionValidation } from './CreateTransactionValidation'

const mongoTransactionRepository = new MongoTransactionsRepository()
const mongoBalanceRepository = new MongoBalanceRepository(
  mongoTransactionRepository
)

const createTransactionUseCase = new CreateTransactionUseCase(
  mongoTransactionRepository,
  mongoBalanceRepository
)

const createTransactionValidation = new CreateTransactionValidation()

const createTransactionController = new CreateTransactionController(
  createTransactionUseCase,
  createTransactionValidation
)

export { createTransactionUseCase, createTransactionController }
