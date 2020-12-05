import { Router } from 'express'

import { createTransactionController } from './CreateTransaction'
import { findTransactionController } from './FindTransaction'
import { listTransactionsController } from './ListTransactions'

const transactionsRoutes = Router()

transactionsRoutes.post('/', (request, response) => {
  return createTransactionController.handle(request, response)
})

transactionsRoutes.get('/', (request, response) => {
  return listTransactionsController.handle(request, response)
})

transactionsRoutes.get('/:id', (request, response) => {
  return findTransactionController.handle(request, response)
})

export { transactionsRoutes }
