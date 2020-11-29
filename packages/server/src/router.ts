import { Router } from "express"
import { createTransactionController } from "@useCases/CreateTransaction"

const router = Router()

router.post('/transactions', (request, response) => {
  return createTransactionController.handle(request, response)
})

export { router }