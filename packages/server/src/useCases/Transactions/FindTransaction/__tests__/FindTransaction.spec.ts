import MongoMock from '@shared/MongoMock'
import { findTransactionUseCase } from '..'
import * as data from './testData'
import { createTransactionUseCase } from '@useCases/Transactions/CreateTransaction'
import { Transaction } from '@entities/Transaction'
import TransactionSchema from '@entities/schemas/Transaction'

let createdTransaction: Transaction

describe('Find transaction', () => {
  beforeAll(async () => {
    await MongoMock.connect()
  })

  afterAll(async () => {
    await MongoMock.disconnect()
  })

  beforeEach(async () => {
    await TransactionSchema.deleteMany({})

    createdTransaction = (await Promise.all(
      data.transactions.map(transaction => createTransactionUseCase.execute(transaction))
    ))[0]
  })

  it('Should find a transaction with given id.', async () => {
    const transaction = await findTransactionUseCase.execute({ id: createdTransaction._id })

    expect(transaction).toBeDefined()
    expect(transaction!._id).toBe(createdTransaction._id)
  })

  it('Should return a falsy value if there is no transaction registered with given id.', async () => {
    const transaction = await findTransactionUseCase.execute({ id: 'some-not-registered-id' })

    expect(transaction).toBeFalsy()
  })
})