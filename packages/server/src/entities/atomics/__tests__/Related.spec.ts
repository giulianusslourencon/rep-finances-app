import { left } from '@shared/Either'

import { InvalidRelatedError } from '../errors/InvalidRelated'
import { Related } from '../Related'

describe('Related validator', () => {
  it('Should allow single character string', () => {
    const relatedOrError = Related.create('P')

    expect(relatedOrError.isRight()).toBeTruthy()
    expect((<Related>relatedOrError.value).value).toBe('P')
  })

  it('Should allow double character string, trim and uppercase it', () => {
    const relatedOrError = Related.create('dp   ')

    expect(relatedOrError.isRight()).toBeTruthy()
    expect((<Related>relatedOrError.value).value).toBe('DP')
  })

  it('Should not allow more than 2 characteres string', () => {
    const relatedOrError = Related.create('aaaaa')

    expect(relatedOrError).toEqual(left(new InvalidRelatedError('aaaaa')))
  })

  it('Should not allow null trimmed string', () => {
    const relatedOrError = Related.create(' ')

    expect(relatedOrError).toEqual(left(new InvalidRelatedError(' ')))
  })

  it('Should not allow special characteres', () => {
    const relatedOrError = Related.create('@2')

    expect(relatedOrError).toEqual(left(new InvalidRelatedError('@2')))
  })

  it('Should not allow strings started in numbers', () => {
    const relatedOrError = Related.create('2a')

    expect(relatedOrError).toEqual(left(new InvalidRelatedError('2a')))
  })
})
