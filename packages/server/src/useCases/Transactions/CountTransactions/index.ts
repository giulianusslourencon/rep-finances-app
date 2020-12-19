import { MongoTransactionsRepository } from '@repositories/mongodb/implementations/MongoTransactionsRepository'

import { CountTransactionsController } from './CountTransactionsController'
import { CountTransactionsUseCase } from './CountTransactionsUseCase'

const mongoTransactionRepository = new MongoTransactionsRepository()

const countTransactionsUseCase = new CountTransactionsUseCase(
  mongoTransactionRepository
)

const countTransactionsController = new CountTransactionsController(
  countTransactionsUseCase
)

export { countTransactionsUseCase, countTransactionsController }
