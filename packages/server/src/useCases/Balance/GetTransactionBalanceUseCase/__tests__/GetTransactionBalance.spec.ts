import MongoMock from '@repositories/mongodb/MongoMock'
import TransactionSchema from '@repositories/mongodb/schemas/Transaction'

import { BalanceProps } from '@shared/@types/Balance'
import { TransactionProps } from '@shared/@types/Transaction'

import { createTransactionUseCase } from '@useCases/Transactions/CreateTransaction'

import { getTransactionBalanceUseCase } from '..'

import * as data from './testData'

let createdTransactions: TransactionProps[]

describe('Get Transaction Balance', () => {
  beforeAll(async () => {
    await MongoMock.connect()

    await TransactionSchema.deleteMany({})

    createdTransactions = (
      await Promise.all(
        data.transactions.map(transaction =>
          createTransactionUseCase.execute(transaction)
        )
      )
    ).map(
      createdTransactionOrError =>
        <TransactionProps>createdTransactionOrError.value
    )
  })

  afterAll(async () => {
    await MongoMock.disconnect()
  })

  it('Should return the correct transaction balance', async () => {
    const balance = getTransactionBalanceUseCase.execute({
      transaction: createdTransactions[0]
    })

    expect((<BalanceProps>balance.value).individual_balance).toEqual({
      P: 10,
      G: -10
    })
  })

  it('Should return the correct transaction balance even when it is an empty object', async () => {
    const balance = getTransactionBalanceUseCase.execute({
      transaction: createdTransactions[1]
    })

    expect((<BalanceProps>balance.value).individual_balance).toEqual({})
  })
})
