import Transaction from '@entities/schemas/Transaction'

import MongoMock from '@shared/MongoMock'

import { listTransactionsUseCase } from '..'

import { createTransactionUseCase } from '@useCases/Transactions/CreateTransaction'

import * as data from './testData'

describe('List transactions', () => {
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

  it('Should list all transactions registered.', async () => {
    const transactions = await listTransactionsUseCase.execute({})

    expect(transactions).toHaveLength(4)
  })

  it('Should list transactions registered with skip and limit.', async () => {
    const transactions = await listTransactionsUseCase.execute({
      skipLimit: { skip: 1, limit: 3 }
    })

    expect(transactions).toHaveLength(3)
    expect(transactions[1].title).toBe(data.transactions[1].title)
    expect(transactions[2].title).toBe(data.transactions[0].title)
  })

  it('Should list transactions registered by month.', async () => {
    const transactions = await listTransactionsUseCase.execute({
      month: '202012'
    })

    expect(transactions).toHaveLength(3)
  })

  it('Should list transactions registered by month with skip and limit.', async () => {
    const transactions = await listTransactionsUseCase.execute({
      skipLimit: { skip: 1, limit: 3 },
      month: '202012'
    })

    expect(transactions).toHaveLength(2)
    expect(transactions[1].title).toBe(data.transactions[0].title)
  })
})
