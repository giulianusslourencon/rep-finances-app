import { UserId } from '@entities/components'
import { InvalidError } from '@entities/errors'

describe('User Id Entity', () => {
  describe('Success Cases', () => {
    it('Should allow single character string', () => {
      const userIdOrError = UserId.create('P')

      expect(userIdOrError.isRight()).toBeTruthy()
      expect((<UserId>userIdOrError.value).value).toBe('P')
    })

    it('Should allow double character string, trim and uppercase it', () => {
      const userIdOrError = UserId.create('dp   ')

      expect(userIdOrError.isRight()).toBeTruthy()
      expect((<UserId>userIdOrError.value).value).toBe('DP')
    })
  })

  describe('Error Cases', () => {
    it('Should not allow more than 2 characteres string', () => {
      const userIdOrError = UserId.create('aaaaa')

      expect(userIdOrError.isLeft()).toBeTruthy()
      expect(userIdOrError.value).toEqual<InvalidError>({
        name: 'InvalidUserIdError',
        value: 'aaaaa',
        reason: 'The user id must contain between 1 and 2 characteres.'
      })
    })

    it('Should not allow null trimmed string', () => {
      const userIdOrError = UserId.create(' ')

      expect(userIdOrError.isLeft()).toBeTruthy()
      expect(userIdOrError.value).toEqual<InvalidError>({
        name: 'InvalidUserIdError',
        value: ' ',
        reason: 'The user id must contain between 1 and 2 characteres.'
      })
    })

    it('Should not allow special characteres', () => {
      const userIdOrError = UserId.create('@2')

      expect(userIdOrError.isLeft()).toBeTruthy()
      expect(userIdOrError.value).toEqual<InvalidError>({
        name: 'InvalidUserIdError',
        value: '@2',
        reason:
          'The id cannot contain special characters, nor can it contain a number in the first position.'
      })
    })

    it('Should not allow strings started in numbers', () => {
      const userIdOrError = UserId.create('2a')

      expect(userIdOrError.isLeft()).toBeTruthy()
      expect(userIdOrError.value).toEqual<InvalidError>({
        name: 'InvalidUserIdError',
        value: '2a',
        reason:
          'The id cannot contain special characters, nor can it contain a number in the first position.'
      })
    })
  })
})
