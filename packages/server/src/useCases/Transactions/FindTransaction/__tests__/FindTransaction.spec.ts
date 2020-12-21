import MongoMock from '@repositories/mongodb/MongoMock'
import TransactionSchema from '@repositories/mongodb/schemas/Transaction'

import { findTransactionUseCase } from '..'

import { TransactionProps } from '@shared/@types/Transaction'

import { createTransactionUseCase } from '@useCases/Transactions/CreateTransaction'

import * as data from './testData'

let createdTransaction: TransactionProps

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
    ).map(transactionOrError => <TransactionProps>transactionOrError.value)[0]
  })

  afterAll(async () => {
    await MongoMock.disconnect()
  })

  it('Should find a transaction with given id.', async () => {
    const transaction = await findTransactionUseCase.execute({
      id: createdTransaction._id
    })

    expect(transaction).toBeDefined()
    expect(transaction?._id).toBe(createdTransaction._id)
  })

  it('Should return a falsy value if there is no transaction registered with given id.', async () => {
    const transaction = await findTransactionUseCase.execute({
      id: 'some-not-registered-id'
    })

    expect(transaction).toBeFalsy()
  })
})
