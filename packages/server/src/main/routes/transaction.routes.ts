import { Router } from 'express'

import { adaptRoute } from '@main/adapters/expressRouteAdapter'
import {
  makeCountTransactions,
  makeCreateTransaction,
  makeFindTransaction,
  makeListTransactions
} from '@main/factories'

export default (router: Router): void => {
  router.get('/transactions', adaptRoute(makeListTransactions()))
  router.get('/transactions/count', adaptRoute(makeCountTransactions()))
  router.get('/transactions/:id', adaptRoute(makeFindTransaction()))
  router.post('/transactions', adaptRoute(makeCreateTransaction()))
}
