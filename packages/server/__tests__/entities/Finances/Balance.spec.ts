import { EntityErrorHandler } from '@entities/errors'
import { Balance, IndividualBalanceProps } from '@entities/Finances'

describe('Balance Entity', () => {
  describe('Success Cases', () => {
    it('Should allow balance with valid related and remove related users with null balance', () => {
      const errorHandler = new EntityErrorHandler()
      const props: IndividualBalanceProps = {
        P: 10,
        g: -10,
        M: 0
      }

      const balance = Balance.create(props, errorHandler)

      expect(errorHandler.hasErrors).toBeFalsy()
      expect(balance.value).toStrictEqual({ P: 10, G: -10 })
    })
  })

  describe('Error Cases', () => {
    it('Should not allow balance with invalid related', () => {
      const errorHandler = new EntityErrorHandler()
      const balance: IndividualBalanceProps = {
        AAAAA: 5,
        G: -5
      }
      Balance.create(balance, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors[0].field).toBe('AAAAA')
      expect(errorHandler.errors[0].error.name).toBe('InvalidUserIdError')
    })
  })
})
