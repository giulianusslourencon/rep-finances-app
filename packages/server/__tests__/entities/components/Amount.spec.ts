import { Amount } from '@entities/components'
import { InvalidError } from '@entities/errors'

describe('Amount Entity', () => {
  describe('Success Cases', () => {
    it('Should allow positive values', () => {
      const amountOrError = Amount.create(5)

      expect(amountOrError.isRight()).toBeTruthy()
      expect((<Amount>amountOrError.value).value).toBe(5)
    })
  })

  describe('Error Cases', () => {
    it('Should not allow negative values', () => {
      const amountOrError = Amount.create(-5)

      expect(amountOrError.isLeft()).toBeTruthy()
      expect(amountOrError.value).toEqual<InvalidError>({
        name: 'InvalidAmountError',
        value: '-5',
        reason: 'The amount must be a positive number.'
      })
    })

    it('Should not allow zero', () => {
      const amountOrError = Amount.create(0)

      expect(amountOrError.isLeft()).toBeTruthy()
      expect(amountOrError.value).toEqual<InvalidError>({
        name: 'InvalidAmountError',
        value: '0',
        reason: 'The amount must be a positive number.'
      })
    })

    it('Should not allow NaN', () => {
      const amountOrError = Amount.create(NaN)

      expect(amountOrError.isLeft()).toBeTruthy()
      expect(amountOrError.value).toEqual<InvalidError>({
        name: 'InvalidAmountError',
        value: 'NaN',
        reason: 'The amount must be a positive number.'
      })
    })
  })
})
