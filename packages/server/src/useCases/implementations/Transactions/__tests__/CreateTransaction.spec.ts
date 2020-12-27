import { InvalidLabelError } from '@entities/atomics/errors'
import { TransactionProps } from '@entities/Transaction'

import {
  MongoBalanceRepository,
  MongoTransactionsRepository
} from '@repositories/mongodb/implementations'
import { BalanceModel } from '@repositories/mongodb/schemas'

import { left } from '@shared/Either'

import { CreateTransactionUseCase } from '@useCases/implementations/Transactions'

import { balances, transactions, transactionToSave } from './testData'

const MongoTransactions = new MongoTransactionsRepository()
const MongoBalance = new MongoBalanceRepository()
const createTransactionUseCase = new CreateTransactionUseCase(
  MongoTransactions,
  MongoBalance
)

describe('Create transaction use case', () => {
  beforeAll(async () => {
    await MongoTransactions.connect()
    await MongoBalance.connect()
  })

  afterAll(async () => {
    await MongoTransactions.disconnect()
    await MongoBalance.disconnect()
  })

  beforeEach(async () => {
    await MongoTransactions.clearCollection()
    await MongoBalance.clearCollection()

    await Promise.all(
      transactions.map(transaction => MongoTransactions.save(transaction))
    )

    await Promise.all(
      balances.map(monthBalance => BalanceModel.create(monthBalance))
    )
  })

  it('Should add a new valid transaction to collection and set all following months to not updated', async () => {
    const createdTransaction = await createTransactionUseCase.execute(
      transactionToSave
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

  it('Should return an error if the given props are not valid and not change balance update field', async () => {
    const transactionError = await createTransactionUseCase.execute({
      ...transactionToSave,
      title: 'A'
    })

    expect(transactionError).toEqual(left(new InvalidLabelError('A')))

    const monthBalances = await BalanceModel.find({}).lean()
    for (const balance of monthBalances) {
      expect(balance.updated).toBeTruthy()
    }
  })
})
