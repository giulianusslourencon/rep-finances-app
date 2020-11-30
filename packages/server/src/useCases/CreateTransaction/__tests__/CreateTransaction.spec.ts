import * as data from './testData'

import MongoMock from '@shared/MongoMock'
import Transaction from '@entities/schemas/Transaction'
import { createTransactionUseCase } from '..';

describe('Create transaction', () => {
  beforeAll(async () => {
    await MongoMock.connect();
  });

  afterAll(async () => {
    await MongoMock.disconnect();
  });

  beforeEach(async () => {
    await Transaction.deleteMany({});
  });

  it('Should create a transaction and return the created Transaction.', async () => {
    const transaction = await createTransactionUseCase.execute(data.transactionSuccess)

    expect(transaction).toHaveProperty('_id')
    expect(transaction).toHaveProperty('amount')
    expect(transaction.amount).toBe(50)
  })

  it('Should not create a transaction with total items values distinct from total paid.', async () => {
    await expect(createTransactionUseCase.execute(data.transactionDistinctValues))
      .rejects
      .toThrow('Items values are distinct from total paid')
  })

  it('Should not create a transaction with amount equal to 0.', async () => {
    await expect(createTransactionUseCase.execute(data.transactionNoMoney))
      .rejects
      .toThrow('There must be some money involved in the transaction')
  })

  it('Should not create a transaction with negative or null items values or payers amount.', async () => {
    await expect(createTransactionUseCase.execute(data.transactionNegativeNull))
      .rejects
      .toThrow('All items values and payers amount must be a positive number')
  })
})