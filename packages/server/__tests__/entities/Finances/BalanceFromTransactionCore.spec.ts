import { EntityErrorHandler } from '@entities/errors'
import {
  BalanceFromTransactionCore,
  TransactionCoreProps
} from '@entities/Finances'

describe('Balance From Transaction Core Entity', () => {
  describe('Success Cases', () => {
    it('Should generate balance from a single transaction', () => {
      const errorHandler = new EntityErrorHandler()
      const transaction: TransactionCoreProps = {
        items: {
          item1: {
            amount: 10,
            related_users: ['P', 'G ']
          }
        },
        payers: {
          P: 10
        }
      }

      const balance = BalanceFromTransactionCore.create(
        transaction,
        errorHandler
      )

      expect(errorHandler.hasErrors).toBeFalsy()
      expect(balance.value.individual_balance).toStrictEqual({ P: 5, G: -5 })
    })
  })
})
