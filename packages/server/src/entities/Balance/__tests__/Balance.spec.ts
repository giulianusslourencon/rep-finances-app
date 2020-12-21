import { BalanceProps } from '@shared/@types/Balance'
import { TransactionCoreProps } from '@shared/@types/Transaction'

import { Balance } from '..'

describe('Balance', () => {
  it('Should generate balance from a single transaction', () => {
    const transaction: TransactionCoreProps = {
      items: {
        item1: {
          value: 10,
          related_users: ['P', 'G']
        }
      },
      payers: {
        P: 10
      }
    }

    const balanceOrError = Balance.create(transaction)

    expect(balanceOrError.isRight()).toBeTruthy()
    expect(
      (<Balance>balanceOrError.value).value.individual_balance
    ).toStrictEqual({ P: 5, G: -5 })
  })

  it('Should generate balance from an array of transactions', () => {
    const transactions: TransactionCoreProps[] = [
      {
        items: {
          item1: {
            value: 10,
            related_users: ['P', 'G']
          }
        },
        payers: {
          P: 10
        }
      },
      {
        items: {
          item1: {
            value: 20,
            related_users: ['P', 'M']
          }
        },
        payers: {
          P: 5,
          M: 15
        }
      }
    ]

    const balanceOrError = Balance.create(transactions)

    expect(balanceOrError.isRight()).toBeTruthy()
    expect(
      (<Balance>balanceOrError.value).value.individual_balance
    ).toStrictEqual({ M: 5, G: -5 })
  })

  it('Should generate balance from an array of transactions and balances', () => {
    const transactions: (TransactionCoreProps | BalanceProps)[] = [
      {
        items: {
          item1: {
            value: 10,
            related_users: ['P', 'G']
          }
        },
        payers: {
          P: 10
        }
      },
      {
        items: {
          item1: {
            value: 20,
            related_users: ['P', 'M']
          }
        },
        payers: {
          P: 5,
          M: 15
        }
      },
      {
        individual_balance: {
          M: -5,
          G: 5
        }
      }
    ]

    const balanceOrError = Balance.create(transactions)

    expect(balanceOrError.isRight()).toBeTruthy()
    expect(
      (<Balance>balanceOrError.value).value.individual_balance
    ).toStrictEqual({})
  })
})
