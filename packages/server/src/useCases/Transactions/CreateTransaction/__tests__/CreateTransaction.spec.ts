import Balance from '@entities/schemas/Balance'
import Transaction from '@entities/schemas/Transaction'

import MongoMock from '@shared/MongoMock'

import { createTransactionUseCase } from '..'

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
    await Transaction.deleteMany({})
    await Balance.deleteMany({})
  })

  it('Should create a transaction and return the created Transaction.', async () => {
    const transaction = await createTransactionUseCase.execute(
      data.transactionSuccess
    )

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
    const createdTransaction = await createTransactionUseCase.execute(
      data.transactionsToBalance.toCreate
    )

    const monthBalances = await Balance.find().lean()

    monthBalances.forEach(month => {
      expect(month.updated).toBe(month._id < createdTransaction.month)
    })
  })

  it('Should not create a transaction with total items values distinct from total paid.', async () => {
    await expect(
      createTransactionUseCase.execute(data.transactionDistinctValues)
    ).rejects.toThrow('Items values are distinct from total paid')
  })

  it('Should not create a transaction with amount equal to 0.', async () => {
    await expect(
      createTransactionUseCase.execute(data.transactionNoMoney)
    ).rejects.toThrow('There must be some money involved in the transaction')
  })

  it('Should not create a transaction with negative or null items values or payers amount.', async () => {
    await expect(
      createTransactionUseCase.execute(data.transactionNegativeNull)
    ).rejects.toThrow(
      'All items values and payers amount must be a positive number'
    )
  })

  it('Should not create a transaction with items that have no related user on.', async () => {
    await expect(
      createTransactionUseCase.execute(data.transactionNoRelatedUsers)
    ).rejects.toThrow('All items must have at least one related user')
  })
})
