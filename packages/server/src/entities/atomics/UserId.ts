import { InvalidUserIdError } from '@entities/atomics/errors'

import { Either, left, right } from '@shared/Either'

export class UserId {
  private readonly userId: string

  private constructor(userId: string) {
    this.userId = userId
    Object.freeze(this)
  }

  static create(userId: string): Either<InvalidUserIdError, UserId> {
    if (!UserId.validate(userId)) {
      return left(new InvalidUserIdError(userId))
    }
    return right(new UserId(userId.toUpperCase().trim()))
  }

  get value(): string {
    return this.userId
  }

  static validate(userId: string): boolean {
    const tester = /^[a-zA-Z][a-zA-Z0-9]?/
    if (!userId || userId.trim().length < 1 || userId.trim().length > 2) {
      return false
    }
    if (!tester.test(userId)) {
      return false
    }
    return true
  }
}
