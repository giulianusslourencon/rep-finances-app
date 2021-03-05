import { MongoTransactionsRepository } from '@repositories/mongodb/implementations'

import { ListTransactionsUseCase } from '@useCases/Transactions/implementations'

import { transactions } from './testData'

const MongoTransactions = new MongoTransactionsRepository()
const listTransactionsUseCase = new ListTransactionsUseCase(MongoTransactions)

describe('List Transactions Use Case', () => {
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
