import { left } from '@shared/Either'

import { InvalidTimestampError } from '../errors/InvalidTimestamp'
import { Timestamp } from '../Timestamp'

describe('Timestamp', () => {
  it('Should allow timestamps in number format', () => {
    const timestampOrError = Timestamp.create(1608336000000)

    expect(timestampOrError.isRight()).toBeTruthy()
    expect((<Timestamp>timestampOrError.value).value).toBe(1608336000000)
  })

  it('Should allow timestamps in string format', () => {
    const timestampOrError = Timestamp.create('2020-12-19')

    expect(timestampOrError.isRight()).toBeTruthy()
    expect((<Timestamp>timestampOrError.value).value).toBe(1608336000000)
  })

  it('Should not allow negative values', () => {
    const timestampOrError = Timestamp.create(-5)

    expect(timestampOrError).toEqual(left(new InvalidTimestampError('-5')))
  })

  it('Should not allow non numbers string', () => {
    const timestampOrError = Timestamp.create('aaa')

    expect(timestampOrError).toEqual(left(new InvalidTimestampError('aaa')))
  })
})
