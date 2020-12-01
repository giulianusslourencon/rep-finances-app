import { transactionsRoutes } from '@useCases/Transactions/transactions.routes'
import { Router } from 'express'

const router = Router()

router.use('/transactions', transactionsRoutes)

export { router }