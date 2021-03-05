import {
  Balance,
  BalanceFromArray,
  BalanceProps,
  TransactionCoreProps
} from '@entities/Balance'

describe('Balance From Array Entity', () => {
  describe('Success Cases', () => {
    it('Should generate balance from an array of transactions', () => {
      const transactions: TransactionCoreProps[] = [
        {
          items: {
            item1: {
              amount: 10,
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
              amount: 20,
              related_users: ['P', 'M']
            }
          },
          payers: {
            P: 5,
            M: 15
          }
        }
      ]

      const balanceOrError = BalanceFromArray.create(transactions)

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
              amount: 10,
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
              amount: 20,
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

      const balanceOrError = BalanceFromArray.create(transactions)

      expect(balanceOrError.isRight()).toBeTruthy()
      expect(
        (<Balance>balanceOrError.value).value.individual_balance
      ).toStrictEqual({})
    })
  })
})
