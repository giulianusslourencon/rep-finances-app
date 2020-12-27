import { Express, Router } from 'express'

import { getBalanceRoutes, getTransactionRoutes } from '@main/routes'

export const setupRoutes = (app: Express): void => {
  const router = Router()

  router.use('/transactions', getTransactionRoutes())
  router.use('/balance', getBalanceRoutes())

  app.use('/api', router)
}
