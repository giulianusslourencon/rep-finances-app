import { MongoTransactionsRepository } from '@repositories/mongodb/implementations'

import { left, right } from '@shared/Either'

import { TransactionNotFoundError } from '@useCases/errors'
import { FindTransactionUseCase } from '@useCases/implementations/Transactions'

import { transactions } from './testData'

const MongoTransactions = new MongoTransactionsRepository()
const findTransactionUseCase = new FindTransactionUseCase(MongoTransactions)

describe('Find transaction use case', () => {
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

  it('Should return all props of a transaction given its id', async () => {
    const foundTransaction = await findTransactionUseCase.execute({
      id: '20201219'
    })

    expect(foundTransaction).toEqual(right(transactions[0]))
  })

  it('Should return an error if there is no transaction registered with the given id', async () => {
    const notFoundTransaction = await findTransactionUseCase.execute({
      id: 'opa'
    })

    expect(notFoundTransaction).toEqual(
      left(new TransactionNotFoundError('opa'))
    )
  })
})
