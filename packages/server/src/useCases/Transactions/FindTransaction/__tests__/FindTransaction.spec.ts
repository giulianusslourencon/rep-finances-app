import { Transaction } from '@entities/Transaction'

import MongoMock from '@repositories/mongodb/MongoMock'
import TransactionSchema from '@repositories/mongodb/schemas/Transaction'

import { findTransactionUseCase } from '..'

import { createTransactionUseCase } from '@useCases/Transactions/CreateTransaction'

import * as data from './testData'

let createdTransaction: Transaction

describe('Find transaction', () => {
  beforeAll(async () => {
    await MongoMock.connect()

    await TransactionSchema.deleteMany({})

    createdTransaction = (
      await Promise.all(
        data.transactions.map(transaction =>
          createTransactionUseCase.execute(transaction)
        )
      )
    )[0]
  })

  afterAll(async () => {
    await MongoMock.disconnect()
  })

  it('Should find a transaction with given id.', async () => {
    const transaction = await findTransactionUseCase.execute({
      id: createdTransaction._id
    })

    expect(transaction).toBeDefined()
    expect(transaction!._id).toBe(createdTransaction._id)
  })

  it('Should return a falsy value if there is no transaction registered with given id.', async () => {
    const transaction = await findTransactionUseCase.execute({
      id: 'some-not-registered-id'
    })

    expect(transaction).toBeFalsy()
  })
})
