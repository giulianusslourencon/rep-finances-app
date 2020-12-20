import { Either, left, right } from '@shared/Either'

import { InvalidTimestampError } from './errors/InvalidTimestamp'

export class Timestamp {
  private readonly timestamp: number

  private constructor(timestamp: number) {
    this.timestamp = timestamp
    Object.freeze(this)
  }

  static create(
    timestamp: number | string | Date
  ): Either<InvalidTimestampError, Timestamp> {
    if (!Timestamp.validate(timestamp)) {
      return left(new InvalidTimestampError(timestamp.toString()))
    }
    return right(new Timestamp(new Date(timestamp).getTime()))
  }

  get value(): number {
    return this.timestamp
  }

  static validate(timestamp: number | string | Date): boolean {
    return new Date(timestamp).getTime() > 0
  }
}
