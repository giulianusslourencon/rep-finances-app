import { Router } from 'express'
import { createTransactionController } from './CreateTransaction'
import { findTransactionController } from './FindTransaction'
import { listTransactionsController } from './ListTransactions'

const transactionsRouter = Router()

transactionsRouter.post('/', (request, response) => {
  return createTransactionController.handle(request, response)
})

transactionsRouter.get('/', (request, response) => {
  return listTransactionsController.handle(request, response)
})

transactionsRouter.get('/:id', (request, response) => {
  return findTransactionController.handle(request, response)
})

export { transactionsRouter }
