import { Path } from '@shared/utils'

import { IErrorHandler, InvalidError } from '@errors/contracts'
import { CustomReason, SizeReason } from '@errors/reasons'

export class UserId {
  private constructor(private readonly userId: string) {}

  static create(
    userId: string,
    errorHandler: IErrorHandler,
    path = new Path()
  ): UserId {
    if (!UserId.validateLength(userId.trim())) {
      errorHandler.addError(
        new InvalidError('User Id', userId, new SizeReason(1, 2)),
        path.resolve()
      )
    }
    if (!UserId.validateCharacteres(userId.trim())) {
      errorHandler.addError(
        new InvalidError(
          'User Id',
          userId,
          new CustomReason(
            'The id cannot contain special characters, nor can it contain a number in the first position.'
          )
        ),
        path.resolve()
      )
    }
    return new UserId(userId.toUpperCase().trim())
  }

  get value(): string {
    return this.userId
  }

  private static validateLength(userId: string): boolean {
    return !(!userId || userId.length < 1 || userId.length > 2)
  }

  private static validateCharacteres(userId: string): boolean {
    const tester = /^[a-zA-Z][a-zA-Z0-9]?$/
    return tester.test(userId)
  }
}
