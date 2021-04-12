import { EntityErrorHandler, InvalidError } from '@entities/errors'
import { SizeReason } from '@entities/errors/reasons'

export class Name {
  private readonly name: string

  private constructor(name: string) {
    this.name = name
    Object.freeze(this)
  }

  static create(
    name: string,
    errorHandler: EntityErrorHandler,
    path = ''
  ): Name {
    if (!Name.validate(name)) {
      errorHandler.addError(
        new InvalidError('Name', name, new SizeReason(2, 64)),
        path
      )
    }
    return new Name(name.trim())
  }

  get value(): string {
    return this.name
  }

  static validate(name: string): boolean {
    if (!name || name.trim().length < 2 || name.trim().length > 64) {
      return false
    }
    return true
  }
}
