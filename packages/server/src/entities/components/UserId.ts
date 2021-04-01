import { InvalidError } from '@entities/errors'
import { CustomReason, SizeReason } from '@entities/errors/reasons'

import { Either, left, right } from '@shared/types'

export class UserId {
  private readonly userId: string

  private constructor(userId: string) {
    this.userId = userId
    Object.freeze(this)
  }

  static create(userId: string): Either<InvalidError, UserId> {
    const validationResult = UserId.validate(userId.trim())
    if (!validationResult.valid) {
      const errorReason =
        validationResult.reason === 'character'
          ? new CustomReason(
              'The id cannot contain special characters, nor can it contain a number in the first position.'
            )
          : new SizeReason(1, 2)
      return left(new InvalidError('Id', userId, errorReason))
    }
    return right(new UserId(userId.toUpperCase().trim()))
  }

  get value(): string {
    return this.userId
  }

  static validate(
    userId: string
  ): { valid: true } | { valid: false; reason: 'length' | 'character' } {
    const tester = /^[a-zA-Z][a-zA-Z0-9]?$/
    if (!userId || userId.length < 1 || userId.length > 2) {
      return { valid: false, reason: 'length' }
    }
    if (!tester.test(userId)) {
      return { valid: false, reason: 'character' }
    }
    return { valid: true }
  }
}
