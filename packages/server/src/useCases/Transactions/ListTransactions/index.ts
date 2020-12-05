import { MongoTransactionsRepository } from '@repositories/implementations/MongoTransactionsRepository'

import { ListTransactionsController } from './ListTransactionsController'
import { ListTransactionsUseCase } from './ListTransactionsUseCase'

const mongoTransactionRepository = new MongoTransactionsRepository()

const listTransactionsUseCase = new ListTransactionsUseCase(
  mongoTransactionRepository
)

const listTransactionsController = new ListTransactionsController(
  listTransactionsUseCase
)

export { listTransactionsUseCase, listTransactionsController }
