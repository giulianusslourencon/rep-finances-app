import { Amount } from '@entities/atomics'
import { InvalidAmountError } from '@entities/atomics/errors'

import { left } from '@shared/Either'

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

      expect(amountOrError).toEqual(left(new InvalidAmountError('-5')))
    })

    it('Should not allow zero', () => {
      const amountOrError = Amount.create(0)

      expect(amountOrError).toEqual(left(new InvalidAmountError('0')))
    })

    it('Should not allow NaN', () => {
      const amountOrError = Amount.create(NaN)

      expect(amountOrError).toEqual(left(new InvalidAmountError('NaN')))
    })
  })
})
