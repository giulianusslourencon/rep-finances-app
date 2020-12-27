import { UserId } from '@entities/atomics'
import { InvalidUserIdError } from '@entities/atomics/errors'

import { left } from '@shared/Either'

describe('UserId', () => {
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

  it('Should not allow more than 2 characteres string', () => {
    const userIdOrError = UserId.create('aaaaa')

    expect(userIdOrError).toEqual(left(new InvalidUserIdError('aaaaa')))
  })

  it('Should not allow null trimmed string', () => {
    const userIdOrError = UserId.create(' ')

    expect(userIdOrError).toEqual(left(new InvalidUserIdError(' ')))
  })

  it('Should not allow special characteres', () => {
    const userIdOrError = UserId.create('@2')

    expect(userIdOrError).toEqual(left(new InvalidUserIdError('@2')))
  })

  it('Should not allow strings started in numbers', () => {
    const userIdOrError = UserId.create('2a')

    expect(userIdOrError).toEqual(left(new InvalidUserIdError('2a')))
  })
})
