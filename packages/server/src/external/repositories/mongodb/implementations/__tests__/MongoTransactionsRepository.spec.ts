import { MongoTransactionsRepository } from '@repositories/mongodb/implementations'

import { transactions, transactionToSave } from './testData'

const MongoTransactions = new MongoTransactionsRepository()

describe('Mongo transactions repository', () => {
  beforeAll(async () => {
    await MongoTransactions.connect()
  })

  afterAll(async () => {
    await MongoTransactions.disconnect()
  })

  beforeEach(async () => {
    await MongoTransactions.clearCollection()

    await Promise.all(
      transactions.map(transaction => MongoTransactions.save(transaction))
    )
  })

  it('Should list all transactions ordered by timestamp', async () => {
    const registeredTransactions = await MongoTransactions.list()

    const transactionsTimestamps = registeredTransactions.map(
      transaction => transaction.timestamp
    )

    const orderedTimestamps = transactions
      .map(transaction => +transaction.timestamp)
      .sort((a, b) => b - a)

    expect(registeredTransactions).toHaveLength(4)
    expect(transactionsTimestamps).toStrictEqual(orderedTimestamps)
  })

  it('Should list transactions with skip and limit', async () => {
    const registeredTransactions = await MongoTransactions.list({
      skip: 1,
      limit: 2
    })

    expect(registeredTransactions).toHaveLength(2)
    expect(registeredTransactions[0]._id).toBe('20201223')
  })

  it('Should list all transactions by month', async () => {
    const registeredTransactions = await MongoTransactions.listByMonth('202011')

    expect(registeredTransactions).toHaveLength(1)
    expect(registeredTransactions[0]._id).toBe('20201117')
  })

  it('Should list transactions by month with skip and limit', async () => {
    const registeredTransactions = await MongoTransactions.listByMonth(
      '202012',
      { skip: 1, limit: 2 }
    )

    expect(registeredTransactions).toHaveLength(1)
    expect(registeredTransactions[0]._id).toBe('20201219')
  })

  it('Should return the number of registered documents on database', async () => {
    const transactionsCount = await MongoTransactions.count()

    expect(transactionsCount).toBe(4)
  })

  it('Should return the number of registered documents on database by month', async () => {
    const transactionsCount = await MongoTransactions.countByMonth('202012')

    expect(transactionsCount).toBe(2)
  })

  it('Should return the items and payers of the transactions registered in a month', async () => {
    const itemsAndPayers = await MongoTransactions.listItemsAndPayersByMonth(
      '202011'
    )

    expect(itemsAndPayers).toHaveLength(1)
    expect(itemsAndPayers[0]).toHaveProperty('items')
    expect(itemsAndPayers[0]).toHaveProperty('payers')
  })

  it('Should add a new transaction to database', async () => {
    await MongoTransactions.save(transactionToSave)

    const createdTransaction = await MongoTransactions.findById(
      transactionToSave._id
    )

    expect(createdTransaction).toBeTruthy()
  })

  it('Should find a transaction by id and return if exists', async () => {
    const foundTransaction = await MongoTransactions.findById(
      transactions[0]._id
    )

    expect(foundTransaction).toBeTruthy()
    expect(foundTransaction?._id).toBe(transactions[0]._id)
  })

  it('Should return a falsy value if a transaction does not exist', async () => {
    const foundTransaction = await MongoTransactions.findById(
      transactionToSave._id
    )

    expect(foundTransaction).toBeFalsy()
  })

  it('Should return a list with all months with registered transactions ordered after the given one', async () => {
    const notRegisteredMonths = await MongoTransactions.getNotRegisteredMonths(
      '202011'
    )

    expect(notRegisteredMonths).toStrictEqual(['202012', '202101'])
  })
})
