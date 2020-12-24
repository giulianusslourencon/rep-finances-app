import { MonthBalance } from '@repositories/attributes'
import { MongoBalanceRepository } from '@repositories/mongodb/implementations'
import { BalanceModel } from '@repositories/mongodb/schemas'

import { balances } from './testData'

const MongoBalance = new MongoBalanceRepository()

describe('Mongo balance repository', () => {
  beforeAll(async () => {
    await MongoBalance.connect()
  })

  afterAll(async () => {
    await MongoBalance.disconnect()
  })

  beforeEach(async () => {
    await MongoBalance.clearCollection()

    await Promise.all(
      balances.map(monthBalance => BalanceModel.create(monthBalance))
    )
  })

  it('Should update month with new balance and set it to updated', async () => {
    const updatedBalance: MonthBalance = {
      individual_balance: {
        P: -10,
        M: 30,
        G: -50,
        F: 30
      }
    }

    await MongoBalance.updateMonth('202012', updatedBalance)

    const updatedMonth = await BalanceModel.findById('202012').lean()

    expect(updatedMonth?.individual_balance).toStrictEqual(
      updatedBalance.individual_balance
    )
    expect(updatedMonth?.updated).toBeTruthy()
  })

  it('Should create a new month if not exists', async () => {
    const updatedBalance: MonthBalance = {
      individual_balance: {
        P: -10,
        M: 60,
        G: -10,
        F: -40
      }
    }

    await MongoBalance.updateMonth('202101', updatedBalance)

    const updatedMonth = await BalanceModel.findById('202101').lean()

    expect(updatedMonth).toBeTruthy()
    expect(updatedMonth?.individual_balance).toStrictEqual(
      updatedBalance.individual_balance
    )
    expect(updatedMonth?.updated).toBeTruthy()
  })

  it('Should return all not updated months', async () => {
    const notUpdatedMonths = await MongoBalance.getNotUpdatedMonths()

    expect(notUpdatedMonths).toStrictEqual(['202012'])
  })

  it('Should return the month balance if registered', async () => {
    const monthBalance = await MongoBalance.getMonthBalance('202011')

    expect(monthBalance).toBeTruthy()
    expect(monthBalance).toStrictEqual({
      individual_balance: balances[0].individual_balance
    })
  })

  it('Should return a falsy value if the month is nor registered', async () => {
    const monthBalance = await MongoBalance.getMonthBalance('202101')

    expect(monthBalance).toBeFalsy()
  })

  it('Should set updated flag to false from given month', async () => {
    const updatedBalance: MonthBalance = {
      individual_balance: {
        P: -10,
        M: 30,
        G: -50,
        F: 30
      }
    }

    await MongoBalance.updateMonth('202012', updatedBalance)

    await MongoBalance.setNotUpdatedFromMonth('202011')

    const notUpdatedMonths = await MongoBalance.getNotUpdatedMonths()

    expect(notUpdatedMonths).toStrictEqual(['202011', '202012'])
  })

  it('Should return the last updated month if exists', async () => {
    const lastUpdatedMonth = await MongoBalance.getLastUpdatedMonth()

    expect(lastUpdatedMonth).toBe('202011')
  })

  it('Should return the last registered month if exists', async () => {
    const lastRegisteredMonth = await MongoBalance.getLastRegisteredMonth()

    expect(lastRegisteredMonth).toBe('202012')
  })
})
