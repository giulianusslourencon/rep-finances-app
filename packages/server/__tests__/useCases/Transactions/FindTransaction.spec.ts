import { TransactionProps } from '@entities/Transaction'

import { MongoTransactionsRepository } from '@repositories/mongodb/implementations'

import { left } from '@shared/Either'

import { TransactionNotFoundError } from '@useCases/errors'
import { FindTransactionUseCase } from '@useCases/Transactions/implementations'

import { transactions } from './testData'

const MongoTransactions = new MongoTransactionsRepository()
const findTransactionUseCase = new FindTransactionUseCase(MongoTransactions)

describe('Find Transaction Use Case', () => {
  beforeAll(async () => {
    await MongoTransactions.connect()
  })

  afterAll(async () => {
    await MongoTransactions.disconnect()
  })

  beforeEach(async () => {
    await MongoTransactions.clearCollection()

    await Promise.all(
      transactions.map(transaction => MongoTransactions.save(transaction))
    )
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

      expect(notFoundTransaction).toEqual(
        left(new TransactionNotFoundError('opa'))
      )
    })
  })
})
