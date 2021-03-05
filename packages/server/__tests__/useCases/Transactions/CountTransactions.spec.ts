import { MongoTransactionsRepository } from '@repositories/mongodb/implementations'

import { CountTransactionsUseCase } from '@useCases/Transactions/implementations'

import { transactions } from './testData'

const MongoTransactions = new MongoTransactionsRepository()
const countTransactionsUseCase = new CountTransactionsUseCase(MongoTransactions)

describe('Count Transactions Use Case', () => {
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
    it('Should return the number of all registered transactions', async () => {
      const transactionsCount = await countTransactionsUseCase.execute({})

      expect(transactionsCount).toBe(4)
    })

    it('Should return the number of registered transactions in a month', async () => {
      const transactionsCount = await countTransactionsUseCase.execute({
        month: '202011'
      })

      expect(transactionsCount).toBe(1)
    })
  })
})
