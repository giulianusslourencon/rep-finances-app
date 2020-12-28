import { InvalidLabelError } from '@entities/atomics/errors'

import { Either, left, right } from '@shared/Either'

export class Label {
  private readonly label: string

  private constructor(label: string) {
    this.label = label
    Object.freeze(this)
  }

  static create(label: string): Either<InvalidLabelError, Label> {
    if (!Label.validate(label)) {
      return left(new InvalidLabelError(label))
    }
    return right(new Label(label.trim()))
  }

  get value(): string {
    return this.label
  }

  static validate(label: string): boolean {
    if (!label || label.trim().length < 2 || label.trim().length > 255) {
      return false
    }
    return true
  }
}
