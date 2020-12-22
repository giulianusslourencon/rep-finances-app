import { InvalidTitleError } from '@entities/atomics/errors'

import { Either, left, right } from '@shared/Either'

export class Title {
  private readonly title: string

  private constructor(title: string) {
    this.title = title
    Object.freeze(this)
  }

  static create(title: string): Either<InvalidTitleError, Title> {
    if (!Title.validate(title)) {
      return left(new InvalidTitleError(title))
    }
    return right(new Title(title))
  }

  get value(): string {
    return this.title
  }

  static validate(title: string): boolean {
    if (!title || title.trim().length < 2 || title.trim().length > 255) {
      return false
    }
    return true
  }
}
