import { CreateTransactionController } from '@server/adapters/presentation/controllers/Transactions'
import { CreateTransactionValidation } from '@server/adapters/presentation/validators/CreateTransactionValidation'

import { MongoBalanceRepository } from '@repositories/mongodb/implementations/MongoBalanceRepository'
import { MongoTransactionsRepository } from '@repositories/mongodb/implementations/MongoTransactionsRepository'

import { CreateTransactionUseCase } from './CreateTransactionUseCase'

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
