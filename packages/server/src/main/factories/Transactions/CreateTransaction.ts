import {
  MongoTransactions,
  MongoBalance,
  idGenerator
} from '@main/factories/external'
import { CreateTransactionControllerOperation } from '@presentation/controllers/Finances/operations'

import { CreateTransactionUseCase } from '@useCases/Finances/implementations'

export const makeCreateTransaction = (): CreateTransactionControllerOperation => {
  const useCase = new CreateTransactionUseCase(
    MongoTransactions,
    MongoBalance,
    idGenerator
  )
  return new CreateTransactionControllerOperation(useCase)
}
