import { UserId } from '@entities/components'
import { EntityErrorHandler, InvalidError } from '@entities/errors'

describe('User Id Entity', () => {
  describe('Success Cases', () => {
    it('Should allow single character string', () => {
      const errorHandler = new EntityErrorHandler()
      const userId = UserId.create('P', errorHandler)

      expect(errorHandler.hasErrors).toBeFalsy()
      expect(userId.value).toBe('P')
    })

    it('Should allow double character string, trim and uppercase it', () => {
      const errorHandler = new EntityErrorHandler()
      const userId = UserId.create('dp     ', errorHandler)

      expect(errorHandler.hasErrors).toBeFalsy()
      expect(userId.value).toBe('DP')
    })
  })

  describe('Error Cases', () => {
    it('Should not allow more than 2 characteres string', () => {
      const errorHandler = new EntityErrorHandler()
      UserId.create('aaaaa', errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.firstError).toEqual<InvalidError>({
        name: 'InvalidUserIdError',
        value: 'aaaaa',
        reason: 'The user id must contain between 1 and 2 characteres.'
      })
    })

    it('Should not allow null trimmed string', () => {
      const errorHandler = new EntityErrorHandler()
      UserId.create(' ', errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.firstError).toEqual<InvalidError>({
        name: 'InvalidUserIdError',
        value: ' ',
        reason: 'The user id must contain between 1 and 2 characteres.'
      })
    })

    it('Should not allow special characteres', () => {
      const errorHandler = new EntityErrorHandler()
      UserId.create('@2', errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.firstError).toEqual<InvalidError>({
        name: 'InvalidUserIdError',
        value: '@2',
        reason:
          'The id cannot contain special characters, nor can it contain a number in the first position.'
      })
    })

    it('Should not allow strings started in numbers', () => {
      const errorHandler = new EntityErrorHandler()
      UserId.create('2a', errorHandler)

      expect(errorHandler.hasErrors).toBeTruthy()
      expect(errorHandler.firstError).toEqual<InvalidError>({
        name: 'InvalidUserIdError',
        value: '2a',
        reason:
          'The id cannot contain special characters, nor can it contain a number in the first position.'
      })
    })
  })
})
