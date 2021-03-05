import {
  MongoTransactionsRepository,
  MongoBalanceRepository
} from '@repositories/mongodb/implementations'
import { BalanceModel } from '@repositories/mongodb/schemas'

import { UpdateRegisteredBalanceUseCase } from '@useCases/Balance/implementations'

import { balances, transactions, updatedBalances } from './testData'

const MongoTransactions = new MongoTransactionsRepository()
const MongoBalance = new MongoBalanceRepository()
const updateRegisteredBalanceUseCase = new UpdateRegisteredBalanceUseCase(
  MongoTransactions,
  MongoBalance
)

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
    await MongoTransactions.clearCollection()
    await MongoBalance.clearCollection()

    await Promise.all(
      transactions.map(transaction => MongoTransactions.save(transaction))
    )

    await Promise.all(
      balances.map(monthBalance => BalanceModel.create(monthBalance))
    )
  })

  describe('Success Cases', () => {
    it('Should update all the month balances in collection', async () => {
      await updateRegisteredBalanceUseCase.execute()

      const balances = await BalanceModel.find({}, { __v: 0 }).lean()

      expect(balances).toStrictEqual(updatedBalances)
    })
  })
})
