import {
  MongoBalanceRepository,
  MongoTransactionsRepository
} from '@repositories/mongodb/implementations'
import { BalanceModel, TransactionModel } from '@repositories/mongodb/schemas'

import {
  GetCurrentBalanceUseCase,
  UpdateRegisteredBalanceUseCase
} from '@useCases/Finances/implementations'

import { SetupFinancesDatabase, updatedBalances } from './database'

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

const DBSetup = new SetupFinancesDatabase(TransactionModel, BalanceModel)

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
    await DBSetup.setupDB()
  })

  describe('Success Cases', () => {
    it('Should update all the month balances in collection and return the current balance', async () => {
      const currentBalance = await getCurrentBalanceUseCase.execute()

      const balances = await BalanceModel.find({}, { __v: 0 }).lean()

      expect(balances).toStrictEqual(updatedBalances)
      expect(currentBalance).toStrictEqual({
        individual_balance: updatedBalances[2].individual_balance
      })
    })
  })
})
