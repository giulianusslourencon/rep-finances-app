import { balanceRoutes } from '@useCases/Balance/balance.routes'
import { transactionsRoutes } from '@useCases/Transactions/transactions.routes'
import { Router } from 'express'

const router = Router()

router.use('/transactions', transactionsRoutes)
router.use('/balance', balanceRoutes)

export { router }
