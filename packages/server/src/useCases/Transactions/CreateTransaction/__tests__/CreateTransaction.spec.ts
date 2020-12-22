import MongoMock from '@repositories/mongodb/implementations/MongoMock'
import Balance from '@repositories/mongodb/schemas/Balance'
import TransactionSchema from '@repositories/mongodb/schemas/Transaction'

import { createTransactionUseCase } from '..'

import { TransactionProps } from '@shared/@types/Transaction'

import { getCurrentBalanceUseCase } from '@useCases/Balance/GetCurrentBalanceUseCase'

import * as data from './testData'

describe('Create transaction', () => {
  beforeAll(async () => {
    await MongoMock.connect()
  })

  afterAll(async () => {
    await MongoMock.disconnect()
  })

  beforeEach(async () => {
    await TransactionSchema.deleteMany({})
    await Balance.deleteMany({})
  })

  it('Should create a transaction and return the created Transaction.', async () => {
    const transactionOrError = await createTransactionUseCase.execute(
      data.transactionSuccess
    )
    expect(transactionOrError.isRight()).toBe(true)

    const transaction = <TransactionProps>transactionOrError.value

    expect(transaction).toHaveProperty('_id')
    expect(transaction).toHaveProperty('amount')
    expect(transaction.amount).toBe(50)
    expect(transaction.related.length).toBe(2)
  })

  it('Should set Balance updated property to true from the new transaction month.', async () => {
    Promise.all(
      data.transactionsToBalance.created.map(transaction =>
        createTransactionUseCase.execute(transaction)
      )
    )

    await getCurrentBalanceUseCase.execute()
    const createdTransactionOrError = await createTransactionUseCase.execute(
      data.transactionsToBalance.toCreate
    )

    const createdTransaction = <TransactionProps>createdTransactionOrError.value

    const monthBalances = await Balance.find().lean()

    monthBalances.forEach(month => {
      expect(month.updated).toBe(month._id < createdTransaction.month)
    })
  })
})
