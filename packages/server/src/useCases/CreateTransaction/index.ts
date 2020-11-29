import { LocalTransactionsRepository } from "@repositories/implementations/LocalTransactionsRepository"
import { CreateTransactionController } from "./CreateTransactionController"
import { CreateTransactionUseCase } from "./CreateTransactionUseCase"

const localTransactionRepository = new LocalTransactionsRepository()

const createTransactionUseCase = new CreateTransactionUseCase(
  localTransactionRepository
)

const createTransactionController = new CreateTransactionController(
  createTransactionUseCase
)

export { createTransactionUseCase, createTransactionController }