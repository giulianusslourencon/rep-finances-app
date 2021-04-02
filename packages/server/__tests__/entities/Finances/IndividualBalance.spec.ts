import { InvalidFields } from '@entities/errors'
import { IndividualBalance } from '@entities/Finances'

describe('Individual Balance Entity', () => {
  describe('Success Cases', () => {
    it('Should allow balance with valid related', () => {
      const individualBalance = {
        P: 5,
        G: -5
      }
      const individualBalanceOrError = IndividualBalance.create(
        individualBalance
      )

      expect(individualBalanceOrError.isRight()).toBeTruthy()
      expect(
        (<IndividualBalance>individualBalanceOrError.value).value
      ).toStrictEqual(individualBalance)
    })
  })

  describe('Error Cases', () => {
    it('Should not allow balance with invalid related', () => {
      const individualBalance = {
        AAAAA: 0
      }
      const individualBalanceOrError = IndividualBalance.create(
        individualBalance
      )

      expect(individualBalanceOrError.isLeft()).toBeTruthy()
      expect(individualBalanceOrError.value).toEqual<InvalidFields>([
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
