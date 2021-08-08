import { Path } from '@shared/utils'

import { EntityErrorHandler, InvalidError } from '@entities/errors'
import { SizeReason } from '@entities/errors/reasons'

export class Name {
  constructor(private readonly name: string) {}

  static create(
    name: string,
    errorHandler: EntityErrorHandler,
    path = new Path()
  ): Name {
    if (!Name.validate(name)) {
      errorHandler.addError(
        new InvalidError('Name', name, new SizeReason(2, 64)),
        path.resolve()
      )
    }
    return new Name(name.trim())
  }

  get value(): string {
    return this.name
  }

  private static validate(name: string): boolean {
    return !(!name || name.trim().length < 2 || name.trim().length > 64)
  }
}
