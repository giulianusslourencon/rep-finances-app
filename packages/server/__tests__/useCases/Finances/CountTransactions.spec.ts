import { SetupTransactionsDatabase } from '@tests/__helpers__/solutions/mongodb'

import { CountTransactionsUseCase } from '@useCases/Finances/implementations'

import { MongoTransactionsRepository } from '@repositories/mongodb/implementations'

const MongoTransactions = new MongoTransactionsRepository()
const countTransactionsUseCase = new CountTransactionsUseCase(MongoTransactions)

const TransactionsSetup = new SetupTransactionsDatabase()

describe('Count Transactions Use Case', () => {
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
