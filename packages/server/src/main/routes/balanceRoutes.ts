import { Router } from 'express'

import { adaptRoute } from '@main/adapters'
import { makeGetCurrentBalance } from '@main/factories/Balance'

export const getBalanceRoutes = (): Router => {
  const router = Router()

  router.get('/', adaptRoute(makeGetCurrentBalance()))

  return router
}
