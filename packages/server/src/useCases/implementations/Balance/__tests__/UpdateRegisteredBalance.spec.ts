import {
  MongoTransactionsRepository,
  MongoBalanceRepository
} from '@repositories/mongodb/implementations'
import { BalanceModel } from '@repositories/mongodb/schemas'

import { UpdateRegisteredBalanceUseCase } from '@useCases/implementations/Balance'

import { balances, transactions, updatedBalances } from './testData'

const MongoTransactions = new MongoTransactionsRepository()
const MongoBalance = new MongoBalanceRepository()
const updateRegisteredBalanceUseCase = new UpdateRegisteredBalanceUseCase(
  MongoTransactions,
  MongoBalance
)

describe('Update registered balance use case', () => {
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

    Promise.all(
      transactions.map(transaction => MongoTransactions.save(transaction))
    )

    Promise.all(balances.map(monthBalance => BalanceModel.create(monthBalance)))
  })

  it('Should update all the month balances in collection', async () => {
    await updateRegisteredBalanceUseCase.execute()

    const balances = await BalanceModel.find().lean()

    expect(balances).toStrictEqual(updatedBalances)
  })
})
