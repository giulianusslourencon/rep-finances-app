import {
  SetupBalanceDatabase,
  SetupTransactionsDatabase
} from '@tests/__helpers__/solutions/mongodb'
import { updatedBalance } from '@tests/__helpers__/solutions/mongodb/data'

import { UpdateRegisteredBalanceUseCase } from '@useCases/Finances/implementations'

import {
  MongoBalanceRepository,
  MongoTransactionsRepository
} from '@repositories/mongodb/implementations'
import { BalanceModel } from '@repositories/mongodb/models'

const MongoTransactions = new MongoTransactionsRepository()
const MongoBalance = new MongoBalanceRepository()
const updateRegisteredBalanceUseCase = new UpdateRegisteredBalanceUseCase(
  MongoTransactions,
  MongoBalance
)

const TransactionsSetup = new SetupTransactionsDatabase()
const BalanceSetup = new SetupBalanceDatabase()

describe('Update Registered Balance Use Case', () => {
  beforeAll(async () => {
    await MongoTransactions.connect()
    await MongoBalance.connect()
  })

  afterAll(async () => {
    await MongoTransactions.disconnect()
    await MongoBalance.disconnect()
  })

  beforeEach(async () => {
    await TransactionsSetup.setupDB()
    await BalanceSetup.setupDB()
  })

  describe('Success Cases', () => {
    it('Should update all the month balances in collection', async () => {
      await updateRegisteredBalanceUseCase.execute()

      const balances = await BalanceModel.find({}, { __v: 0 }).lean()

      expect(balances).toStrictEqual(updatedBalance)
    })
  })
})
