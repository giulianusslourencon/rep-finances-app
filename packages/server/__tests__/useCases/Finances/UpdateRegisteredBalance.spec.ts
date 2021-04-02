import {
  MongoTransactionsRepository,
  MongoBalanceRepository
} from '@repositories/mongodb/implementations'
import { BalanceModel, TransactionModel } from '@repositories/mongodb/schemas'

import { UpdateRegisteredBalanceUseCase } from '@useCases/Finances/implementations'

import { SetupFinancesDatabase, updatedBalances } from './database'

const MongoTransactions = new MongoTransactionsRepository()
const MongoBalance = new MongoBalanceRepository()
const updateRegisteredBalanceUseCase = new UpdateRegisteredBalanceUseCase(
  MongoTransactions,
  MongoBalance
)

const DBSetup = new SetupFinancesDatabase(TransactionModel, BalanceModel)

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
    await DBSetup.setupDB()
  })

  describe('Success Cases', () => {
    it('Should update all the month balances in collection', async () => {
      await updateRegisteredBalanceUseCase.execute()

      const balances = await BalanceModel.find({}, { __v: 0 }).lean()

      expect(balances).toStrictEqual(updatedBalances)
    })
  })
})
