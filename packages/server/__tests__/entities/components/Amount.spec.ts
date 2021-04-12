import { Amount } from '@entities/components'
import { EntityErrorHandler, InvalidError } from '@entities/errors'

describe('Amount Entity', () => {
  describe('Success Cases', () => {
    it('Should allow positive values', () => {
      const errorHandler = new EntityErrorHandler()
      const amount = Amount.create(5, errorHandler)

      expect(errorHandler.hasErrors).toBeFalsy()
      expect(amount.value).toBe(5)
    })
  })

  describe('Error Cases', () => {
    it('Should not allow negative values', () => {
      const errorHandler = new EntityErrorHandler()
      Amount.create(-5, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.firstError).toEqual<InvalidError>({
        name: 'InvalidAmountError',
        value: '-5',
        reason: 'The amount must be a positive number.'
      })
    })

    it('Should not allow zero', () => {
      const errorHandler = new EntityErrorHandler()
      Amount.create(0, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.firstError).toEqual<InvalidError>({
        name: 'InvalidAmountError',
        value: '0',
        reason: 'The amount must be a positive number.'
      })
    })

    it('Should not allow NaN', () => {
      const errorHandler = new EntityErrorHandler()
      Amount.create(NaN, errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.firstError).toEqual<InvalidError>({
        name: 'InvalidAmountError',
        value: 'NaN',
        reason: 'The amount must be a positive number.'
      })
    })
  })
})
