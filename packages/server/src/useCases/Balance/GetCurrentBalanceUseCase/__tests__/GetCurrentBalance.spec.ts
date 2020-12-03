import TransactionSchema from '@entities/schemas/Transaction'
import BalanceSchema from '@entities/schemas/Balance'
import { getCurrentBalanceUseCase } from '..'
import { createTransactionUseCase } from '@useCases/Transactions/CreateTransaction'
import MongoMock from '@shared/MongoMock'
import * as data from './testData'

describe('Get Current Balance', () => {
  beforeAll(async () => {
    await MongoMock.connect()

    await TransactionSchema.deleteMany({})
    await BalanceSchema.deleteMany({})
    await Promise.all(
      data.transactions.map(transaction => createTransactionUseCase.execute(transaction))
    )
  })

  afterAll(async () => {
    await MongoMock.disconnect()
  })

  it('Should get the current balance among all related users.', async () => {
    const balance = await getCurrentBalanceUseCase.execute()

    expect(balance.individual_balance).toEqual({
      P: 237.5,
      G: -32.5,
      M: -202.5,
      F: -2.5
    })

    const balances = await BalanceSchema.find()
    for (const monthBalance of balances) {
      expect(monthBalance.updated).toBe(true)
    }
  })
})