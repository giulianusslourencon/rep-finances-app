import { transactionsRouter } from '@useCases/Transactions/transactions.routes'
import { Router } from 'express'

const router = Router()

router.use('/transactions', transactionsRouter)

export { router }