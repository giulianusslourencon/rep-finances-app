import { EntityErrorHandler, InvalidFields } from '@entities/errors'
import { IndividualBalance, IndividualBalanceProps } from '@entities/Finances'

describe('Individual Balance Entity', () => {
  describe('Success Cases', () => {
    it('Should allow balance with valid related', () => {
      const errorHandler = new EntityErrorHandler()
      const balance: IndividualBalanceProps = {
        'P ': 5,
        g: -5
      }
      const individualBalance = IndividualBalance.create(balance, errorHandler)

      expect(errorHandler.hasErrors).toBeFalsy()
      expect(individualBalance.value).toStrictEqual<IndividualBalanceProps>({
        P: 5,
        G: -5
      })
    })
  })

  describe('Error Cases', () => {
    it('Should not allow balance with invalid related', () => {
      const errorHandler = new EntityErrorHandler()
      const balance: IndividualBalanceProps = {
        AAAAA: 0
      }
      IndividualBalance.create(balance, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.errors).toEqual<InvalidFields>([
        {
          field: 'AAAAA',
          error: {
            name: 'InvalidUserIdError',
            value: 'AAAAA',
            reason: 'The user id must contain between 1 and 2 characteres.'
          }
        }
      ])
    })
  })
})
