import { Router } from 'express'

import { balanceRoutes } from '@useCases/Balance/balance.routes'
import { transactionsRoutes } from '@useCases/Transactions/transactions.routes'

const router = Router()

router.use('/transactions', transactionsRoutes)
router.use('/balance', balanceRoutes)

export { router }
