import MongoMock from '@shared/MongoMock'
import Transaction from '@entities/schemas/Transaction'
import { listTransactionsUseCase } from '..'
import * as data from './testData'
import { createTransactionUseCase } from '@useCases/CreateTransaction'

describe('List transactions', () => {
  beforeAll(async () => {
    await MongoMock.connect()
  })

  afterAll(async () => {
    await MongoMock.disconnect()
  })

  beforeEach(async () => {
    await Transaction.deleteMany({})
    await Promise.all(
      data.transactions.map(transaction => createTransactionUseCase.execute(transaction))
    )
  })

  it('Should list all transactions registered.', async () => {
    const transactions = await listTransactionsUseCase.execute()

    expect(transactions).toHaveLength(data.transactions.length)
  })

  it('Should list transactions registered with skip and limit.', async () => {
    const transactions = await listTransactionsUseCase.execute({ skip: 1, limit: 3 })

    expect(transactions).toHaveLength(3)
    expect(transactions[1].title).toBe(data.transactions[2].title)
  })
})