import { TransactionBuilder } from '@tests/__helpers__/builders/Finances'
import { SetupTransactionsDatabase } from '@tests/__helpers__/solutions/mongodb'
import { transactions } from '@tests/__helpers__/solutions/mongodb/data'

import { TransactionProps } from '@entities/Finances'

import { MongoTransactionsRepository } from '@repositories/mongodb/implementations'

const MongoTransactions = new MongoTransactionsRepository()
const TransactionsSetup = new SetupTransactionsDatabase()

describe('Mongo Transactions Repository', () => {
  beforeAll(async () => {
    await MongoTransactions.connect()
  })

  afterAll(async () => {
    await MongoTransactions.disconnect()
  })

  beforeEach(async () => {
    await TransactionsSetup.setupDB()
  })

  describe('List', () => {
    it('Should list all transactions ordered by Date', async () => {
      const registeredTransactions = await MongoTransactions.list()

      const transactionsDates = registeredTransactions.map(transaction =>
        transaction.date.getTime()
      )

      const orderedDates = transactions
        .map(transaction => transaction.date.getTime())
        .sort((a, b) => b - a)

      expect(registeredTransactions).toHaveLength(4)
      expect(transactionsDates).toStrictEqual(orderedDates)
    })

    it('Should list transactions with skip and limit', async () => {
      const registeredTransactions = await MongoTransactions.list({
        skip: 1,
        limit: 2
      })

      expect(registeredTransactions).toHaveLength(2)
      expect(registeredTransactions[0]._id).toBe('20201223')
    })
  })

  describe('List By Month', () => {
    it('Should list all transactions by month', async () => {
      const registeredTransactions = await MongoTransactions.listByMonth(
        '202011'
      )

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
  })

  describe('Count', () => {
    it('Should return the number of registered documents on database', async () => {
      const transactionsCount = await MongoTransactions.count()

      expect(transactionsCount).toBe(4)
    })
  })

  describe('Count By Month', () => {
    it('Should return the number of registered documents on database by month', async () => {
      const transactionsCount = await MongoTransactions.countByMonth('202012')

      expect(transactionsCount).toBe(2)
    })
  })

  describe('List Items And Payers By Month', () => {
    it('Should return the items and payers of the transactions registered in a month', async () => {
      const itemsAndPayers = await MongoTransactions.listItemsAndPayersByMonth(
        '202011'
      )

      expect(itemsAndPayers).toHaveLength(1)
      expect(itemsAndPayers[0]).toHaveProperty('items')
      expect(itemsAndPayers[0]).toHaveProperty('payers')
    })
  })

  describe('Save', () => {
    it('Should add a new transaction to database', async () => {
      const transactionToSave = TransactionBuilder.aTransaction().build()
      await MongoTransactions.save(transactionToSave)

      const createdTransaction = await MongoTransactions.findById(
        transactionToSave._id
      )

      expect(createdTransaction).toBeTruthy()
    })
  })

  describe('Find By Id', () => {
    it('Should find a transaction by id and return if exists', async () => {
      const foundTransaction = await MongoTransactions.findById(
        transactions[0]._id
      )

      expect(foundTransaction).toBeTruthy()
      expect((<TransactionProps>foundTransaction)._id).toBe(transactions[0]._id)
    })

    it('Should return a falsy value if a transaction does not exist', async () => {
      const foundTransaction = await MongoTransactions.findById(
        'idquenaoexiste'
      )

      expect(foundTransaction).toBeFalsy()
    })
  })

  describe('Get Not Registered Months', () => {
    it('Should return a list with all months with registered transactions ordered after the given one', async () => {
      const notRegisteredMonths = await MongoTransactions.getNotRegisteredMonths(
        '202011'
      )

      expect(notRegisteredMonths).toStrictEqual(['202012', '202101'])
    })
  })
})
