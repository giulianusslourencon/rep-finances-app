import { MongoTransactionsRepository } from '@repositories/mongodb/implementations'

import { CountTransactionsUseCase } from '@useCases/implementations/Transactions'

import { transactions } from './testData'

const MongoTransactions = new MongoTransactionsRepository()
const countTransactionsUseCase = new CountTransactionsUseCase(MongoTransactions)

describe('Count transactions use case', () => {
  beforeAll(async () => {
    await MongoTransactions.connect()
  })

  afterAll(async () => {
    await MongoTransactions.disconnect()
  })

  beforeEach(async () => {
    await MongoTransactions.clearCollection()

    Promise.all(
      transactions.map(transaction => MongoTransactions.save(transaction))
    )
  })

  it('Should return the number of all registered transactions', async () => {
    const transactionsCount = await countTransactionsUseCase.execute({})

    expect(transactionsCount).toBe(4)
  })

  it('Should return the number of registered transactions in a month', async () => {
    const transactionsCount = await countTransactionsUseCase.execute({
      month: '202011'
    })

    expect(transactionsCount).toBe(1)
  })
})
