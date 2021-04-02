import { TransactionInitialPropsBuilder } from '@tests/builders'

import { InvalidFields } from '@entities/errors'
import { TransactionProps } from '@entities/Finances'

import {
  MongoBalanceRepository,
  MongoTransactionsRepository
} from '@repositories/mongodb/implementations'
import { BalanceModel, TransactionModel } from '@repositories/mongodb/schemas'

import { CreateTransactionUseCase } from '@useCases/Finances/implementations'

import { SetupFinancesDatabase } from './database'

const MongoTransactions = new MongoTransactionsRepository()
const MongoBalance = new MongoBalanceRepository()
const createTransactionUseCase = new CreateTransactionUseCase(
  MongoTransactions,
  MongoBalance
)

const DBSetup = new SetupFinancesDatabase(TransactionModel, BalanceModel)

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
    await DBSetup.setupDBUpdated()
  })

  describe('Success Cases', () => {
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

      expect(transactionError.value).toEqual<InvalidFields>([
        {
          field: 'title',
          error: {
            name: 'InvalidNameError',
            value: 'A',
            reason: 'The name must contain between 2 and 64 characteres.'
          }
        }
      ])

      const monthBalances = await BalanceModel.find({}).lean()
      for (const balance of monthBalances) {
        expect(balance.updated).toBeTruthy()
      }
    })
  })
})
