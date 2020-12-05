import { Router } from 'express'

import { getCurrentBalanceController } from './GetCurrentBalanceUseCase'

const balanceRoutes = Router()

balanceRoutes.get('/', (request, response) => {
  return getCurrentBalanceController.handle(request, response)
})

export { balanceRoutes }
