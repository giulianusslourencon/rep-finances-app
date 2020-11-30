import { Router } from "express"
import { createTransactionController } from "@useCases/CreateTransaction"
import { listTransactionsController } from "@useCases/ListTransactions"

const router = Router()

router.post('/transactions', (request, response) => {
  return createTransactionController.handle(request, response)
})
router.get('/transactions', (request, response) => {
  return listTransactionsController.handle(request, response)
})

export { router }