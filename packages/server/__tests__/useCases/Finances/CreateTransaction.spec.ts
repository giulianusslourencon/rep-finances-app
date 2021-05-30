import { TransactionInitialPropsBuilder } from '@tests/builders/Finances'
import {
  SetupBalanceDatabase,
  SetupTransactionsDatabase
} from '@tests/solutions/mongodb'
import { makeIdGeneratorStub } from '@tests/solutions/utils'

import { InvalidFields } from '@entities/errors'
import { TransactionProps } from '@entities/Finances'

import { CreateTransactionUseCase } from '@useCases/Finances/implementations'

import {
  MongoBalanceRepository,
  MongoTransactionsRepository
} from '@repositories/mongodb/implementations'
import { BalanceModel } from '@repositories/mongodb/models'

const MongoTransactions = new MongoTransactionsRepository()
const MongoBalance = new MongoBalanceRepository()
const idGeneratorStub = makeIdGeneratorStub()

const createTransactionUseCase = new CreateTransactionUseCase(
  MongoTransactions,
  MongoBalance,
  idGeneratorStub
)

const TransactionsSetup = new SetupTransactionsDatabase()
const BalanceSetup = new SetupBalanceDatabase()

describe('Create Transaction Use Case', () => {
  beforeAll(async () => {
    await MongoTransactions.connect()
    await MongoBalance.connect()
  })

  afterAll(async () => {
    await MongoTransactions.disconnect()
    await MongoBalance.disconnect()
  })

  beforeEach(async () => {
    await TransactionsSetup.setupDB()
    await BalanceSetup.setupDBUpdated()
  })

  describe('Success Cases', () => {
    it('Should generate a unique id for the new transaction', async () => {
      const idGeneratorSpy = jest.spyOn(idGeneratorStub, 'generateUniqueId')

      await createTransactionUseCase.execute(
        TransactionInitialPropsBuilder.aTransaction().build()
      )

      expect(idGeneratorSpy).toBeCalled()
    })

    it('Should add a new valid transaction to collection and set all following months to not updated', async () => {
      const createdTransaction = await createTransactionUseCase.execute(
        TransactionInitialPropsBuilder.aTransaction().build()
      )

      expect(createdTransaction.isRight()).toBeTruthy()

      const foundTransaction = await MongoTransactions.findById(
        (<TransactionProps>createdTransaction.value)._id
      )

      expect(foundTransaction).toBeTruthy()

      const monthBalances = await BalanceModel.find({}).lean()
      for (const balance of monthBalances) {
        expect(balance.updated).toBe(balance._id < '202012')
      }
    })
  })

  describe('User Error Cases', () => {
    it('Should return an error if the given props are not valid and not change balance update field', async () => {
      const transactionError = await createTransactionUseCase.execute(
        TransactionInitialPropsBuilder.aTransaction().withInvalidTitle().build()
      )

      expect(transactionError.isLeft()).toBeTruthy()
      const errors = transactionError.value as InvalidFields
      expect(errors[0].field).toBe('title')
      expect(errors[0].error.name).toBe('InvalidNameError')

      const monthBalances = await BalanceModel.find({}).lean()
      for (const balance of monthBalances) {
        expect(balance.updated).toBeTruthy()
      }
    })
  })
})
