import {
  SetupBalanceDatabase,
  SetupTransactionsDatabase
} from '@tests/solutions/mongodb'
import { updatedBalance } from '@tests/solutions/mongodb/data'

import {
  GetCurrentBalanceUseCase,
  UpdateRegisteredBalanceUseCase
} from '@useCases/Finances/implementations'

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

const getCurrentBalanceUseCase = new GetCurrentBalanceUseCase(
  MongoBalance,
  updateRegisteredBalanceUseCase
)

const TransactionsSetup = new SetupTransactionsDatabase()
const BalanceSetup = new SetupBalanceDatabase()

describe('Get Current Balance Use Case', () => {
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
    it('Should update all the month balances in collection and return the current balance', async () => {
      const currentBalance = await getCurrentBalanceUseCase.execute()

      const balances = await BalanceModel.find({}, { __v: 0 }).lean()

      expect(balances).toStrictEqual(updatedBalance)
      expect(currentBalance).toStrictEqual({
        individual_balance: updatedBalance[2].individual_balance
      })
    })
  })
})
