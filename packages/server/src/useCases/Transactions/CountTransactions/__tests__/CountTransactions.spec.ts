import Transaction from '@entities/schemas/Transaction'

import MongoMock from '@shared/MongoMock'

import { createTransactionUseCase } from '@useCases/Transactions/CreateTransaction'

import { countTransactionsUseCase } from '..'

import * as data from './testData'

describe('Count transactions', () => {
  beforeAll(async () => {
    await MongoMock.connect()

    await Transaction.deleteMany({})
    await Promise.all(
      data.transactions.map(transaction =>
        createTransactionUseCase.execute(transaction)
      )
    )
  })

  afterAll(async () => {
    await MongoMock.disconnect()
  })

  it('Should return the number of registered transactions.', async () => {
    const transactionsCount = await countTransactionsUseCase.execute({})

    expect(transactionsCount).toBe(4)
  })

  it('Should return the number of registered transactions at the given month.', async () => {
    const transactionsCount = await countTransactionsUseCase.execute({
      month: '202012'
    })

    expect(transactionsCount).toBe(3)
  })
})
