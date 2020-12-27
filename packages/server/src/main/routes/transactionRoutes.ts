import { Router } from 'express'

import { adaptRoute } from '@main/adapters/expressRouteAdapter'
import {
  makeCountTransactions,
  makeCreateTransaction,
  makeFindTransaction,
  makeListTransactions
} from '@main/factories'

export const getTransactionRoutes = (): Router => {
  const router = Router()

  router.get('/', adaptRoute(makeListTransactions()))
  router.get('/count', adaptRoute(makeCountTransactions()))
  router.get('/:id', adaptRoute(makeFindTransaction()))
  router.post('/', adaptRoute(makeCreateTransaction()))

  return router
}
