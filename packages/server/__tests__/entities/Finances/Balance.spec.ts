import { EntityErrorHandler, InvalidFields } from '@entities/errors'
import { Balance, BalanceProps } from '@entities/Finances'

describe('Balance Entity', () => {
  describe('Success Cases', () => {
    it('Should remove related users with null balance', () => {
      const errorHandler = new EntityErrorHandler()
      const props: BalanceProps = {
        individual_balance: {
          P: 10,
          g: -10,
          M: 0
        }
      }

      const balance = Balance.create(props, errorHandler)

      expect(errorHandler.hasErrors).toBeFalsy()
      expect(balance.value.individual_balance).toStrictEqual({ P: 10, G: -10 })
    })
  })

  describe('Error Cases', () => {
    it('Should not allow invalid individual balance', () => {
      const errorHandler = new EntityErrorHandler()
      const props: BalanceProps = {
        individual_balance: {
          P: 10,
          ggg: -10
        }
      }

      Balance.create(props, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors).toEqual<InvalidFields>([
        {
          field: 'individual_balance.ggg',
          error: {
            name: 'InvalidUserIdError',
            value: 'ggg',
            reason: 'The user id must contain between 1 and 2 characteres.'
          }
        }
      ])
    })
  })
})
