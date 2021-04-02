import { MongoTransactionsRepository } from '@repositories/mongodb/implementations'
import { BalanceModel, TransactionModel } from '@repositories/mongodb/schemas'

import { CountTransactionsUseCase } from '@useCases/Finances/implementations'

import { SetupFinancesDatabase } from './database'

const MongoTransactions = new MongoTransactionsRepository()
const countTransactionsUseCase = new CountTransactionsUseCase(MongoTransactions)

const DBSetup = new SetupFinancesDatabase(TransactionModel, BalanceModel)

describe('Count Transactions Use Case', () => {
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
