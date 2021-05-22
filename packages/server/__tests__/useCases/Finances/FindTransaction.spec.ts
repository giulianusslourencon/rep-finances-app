import { SetupTransactionsDatabase } from '@tests/__helpers__/solutions/mongodb'

import { TransactionProps } from '@entities/Finances'

import { NotFoundError } from '@useCases/errors'
import { FindTransactionUseCase } from '@useCases/Finances/implementations'

import { MongoTransactionsRepository } from '@repositories/mongodb/implementations'
import { TransactionModel } from '@repositories/mongodb/models'

const MongoTransactions = new MongoTransactionsRepository()
const findTransactionUseCase = new FindTransactionUseCase(MongoTransactions)

const TransactionsSetup = new SetupTransactionsDatabase(TransactionModel)

describe('Find Transaction Use Case', () => {
  beforeAll(async () => {
    await MongoTransactions.connect()
  })

  afterAll(async () => {
    await MongoTransactions.disconnect()
  })

  beforeEach(async () => {
    await TransactionsSetup.setupDB()
  })

  describe('Success Cases', () => {
    it('Should return all props of a transaction given its id', async () => {
      const foundTransaction = await findTransactionUseCase.execute({
        id: '20201219'
      })

      expect(foundTransaction.isRight()).toBeTruthy()
      expect((<TransactionProps>foundTransaction.value)._id).toBe('20201219')
    })
  })

  describe('User Error Cases', () => {
    it('Should return an error if there is no transaction registered with the given id', async () => {
      const notFoundTransaction = await findTransactionUseCase.execute({
        id: 'opa'
      })

      expect(notFoundTransaction.isLeft()).toBeTruthy()
      const error = notFoundTransaction.value as NotFoundError
      expect(error.name).toBe('TransactionNotFoundError')
      expect(error.key).toBe('id')
      expect(error.value).toBe('opa')
    })
  })
})
