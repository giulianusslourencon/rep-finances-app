import { SetupTransactionsDatabase } from '@tests/solutions/mongodb'

import { ListTransactionsUseCase } from '@useCases/Finances/implementations'

import { MongoTransactionsRepository } from '@repositories/mongodb/implementations'

const MongoTransactions = new MongoTransactionsRepository()
const listTransactionsUseCase = new ListTransactionsUseCase(MongoTransactions)

const TransactionsSetup = new SetupTransactionsDatabase()

describe('List Transactions Use Case', () => {
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
    it('Should return a list of all registered transactions', async () => {
      const transactionsList = await listTransactionsUseCase.execute({})

      expect(transactionsList).toHaveLength(4)
    })

    it('Should return a list of registered transactions in a month', async () => {
      const transactionsList = await listTransactionsUseCase.execute({
        month: '202011'
      })

      expect(transactionsList).toHaveLength(1)
      expect(transactionsList[0]._id).toBe('20201117')
    })
  })
})
