import { Either, left, right } from '@shared/Either'

import { InvalidRelatedError } from './errors/InvalidRelated'

export class Related {
  private readonly related: string

  private constructor(related: string) {
    this.related = related
    Object.freeze(this)
  }

  static create(related: string): Either<InvalidRelatedError, Related> {
    if (!Related.validate(related)) {
      return left(new InvalidRelatedError(related))
    }
    return right(new Related(related.toUpperCase().trim()))
  }

  get value(): string {
    return this.related
  }

  static validate(related: string): boolean {
    const tester = /^[a-zA-Z][a-zA-Z0-9]?/
    if (!related || related.trim().length < 1 || related.trim().length > 2) {
      return false
    }
    if (!tester.test(related)) {
      return false
    }
    return true
  }
}
