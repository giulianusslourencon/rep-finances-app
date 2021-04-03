import {
  MongoTransactions,
  MongoBalance,
  idGenerator
} from '@main/factories/external'
import { CreateTransactionController } from '@presentation/controllers/Finances/implementations'

import { CreateTransactionUseCase } from '@useCases/Finances/implementations'

export const makeCreateTransaction = () => {
  const useCase = new CreateTransactionUseCase(
    MongoTransactions,
    MongoBalance,
    idGenerator
  )
  return new CreateTransactionController(useCase)
}
