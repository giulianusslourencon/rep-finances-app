import { TransactionProps } from '@entities/Finances'

import { MongoTransactionsRepository } from '@repositories/mongodb/implementations'
import { BalanceModel, TransactionModel } from '@repositories/mongodb/schemas'

import { UseCaseError } from '@useCases/errors'
import { FindTransactionUseCase } from '@useCases/Finances/implementations'

import { SetupFinancesDatabase } from './database'

const MongoTransactions = new MongoTransactionsRepository()
const findTransactionUseCase = new FindTransactionUseCase(MongoTransactions)

const DBSetup = new SetupFinancesDatabase(TransactionModel, BalanceModel)

describe('Find Transaction Use Case', () => {
  beforeAll(async () => {
    await MongoTransactions.connect()
  })

  afterAll(async () => {
    await MongoTransactions.disconnect()
  })

  beforeEach(async () => {
    await DBSetup.setupDB()
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

      expect(notFoundTransaction.value).toEqual<UseCaseError>({
        name: 'TransactionNotFoundError',
        key: 'id',
        value: 'opa',
        message: 'There is no transaction registered with id "opa"'
      })
    })
  })
})
