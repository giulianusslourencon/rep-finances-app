import {
  Balance,
  BalanceFromTransactionCore,
  TransactionCoreProps
} from '@entities/Balance'

describe('Balance From Transaction Core Entity', () => {
  describe('Success Cases', () => {
    it('Should generate balance from a single transaction', () => {
      const transaction: TransactionCoreProps = {
        items: {
          item1: {
            amount: 10,
            related_users: ['P', 'G']
          }
        },
        payers: {
          P: 10
        }
      }

      const balanceOrError = BalanceFromTransactionCore.create(transaction)

      expect(balanceOrError.isRight()).toBeTruthy()
      expect(
        (<Balance>balanceOrError.value).value.individual_balance
      ).toStrictEqual({ P: 5, G: -5 })
    })
  })
})
