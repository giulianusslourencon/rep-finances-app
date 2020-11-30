import { MongoTransactionsRepository } from "@repositories/implementations/MongoTransactionsRepository"
import { CreateTransactionController } from "./CreateTransactionController"
import { CreateTransactionUseCase } from "./CreateTransactionUseCase"

const mongoTransactionRepository = new MongoTransactionsRepository()

const createTransactionUseCase = new CreateTransactionUseCase(
  mongoTransactionRepository
)

const createTransactionController = new CreateTransactionController(
  createTransactionUseCase
)

export { createTransactionUseCase, createTransactionController }