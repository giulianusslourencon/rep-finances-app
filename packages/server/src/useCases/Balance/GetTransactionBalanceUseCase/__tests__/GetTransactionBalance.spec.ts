import TransactionSchema from '@entities/schemas/Transaction'
import { Transaction } from '@entities/Transaction'

import MongoMock from '@shared/MongoMock'

import { createTransactionUseCase } from '@useCases/Transactions/CreateTransaction'

import { getTransactionBalanceUseCase } from '..'

import * as data from './testData'

let createdTransactions: Transaction[]

describe('Get Transaction Balance', () => {
  beforeAll(async () => {
    await MongoMock.connect()

    await TransactionSchema.deleteMany({})

    createdTransactions = await Promise.all(
      data.transactions.map(transaction =>
        createTransactionUseCase.execute(transaction)
      )
    )
  })

  afterAll(async () => {
    await MongoMock.disconnect()
  })

  it('Should return the correct transaction balance', async () => {
    const balance = getTransactionBalanceUseCase.execute({
      transaction: createdTransactions[0]
    })

    expect(balance.individual_balance).toEqual({
      P: 10,
      G: -10
    })
  })

  it('Should return the correct transaction balance even when it is an empty object', async () => {
    const balance = getTransactionBalanceUseCase.execute({
      transaction: createdTransactions[1]
    })

    expect(balance.individual_balance).toEqual({})
  })
})
