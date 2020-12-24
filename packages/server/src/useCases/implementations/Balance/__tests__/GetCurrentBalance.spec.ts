import {
  MongoTransactionsRepository,
  MongoBalanceRepository
} from '@repositories/mongodb/implementations'
import { BalanceModel } from '@repositories/mongodb/schemas'

import { GetCurrentBalanceUseCase } from '@useCases/implementations/Balance'

import { UpdateRegisteredBalanceUseCase } from '../UpdateRegisteredBalanceUseCase'
import { balances, transactions, updatedBalances } from './testData'

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

describe('Get current balance use case', () => {
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

  it('Should update all the month balances in collection and return the current balance', async () => {
    const currentBalance = await getCurrentBalanceUseCase.execute()

    const balances = await BalanceModel.find({}, { __v: 0 }).lean()

    expect(balances).toStrictEqual(updatedBalances)
    expect(currentBalance).toStrictEqual({
      individual_balance: updatedBalances[2].individual_balance
    })
  })
})
