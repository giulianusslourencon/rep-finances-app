import { IErrorReason } from '@entities/errors'

export class DuplicateReason implements IErrorReason {
  constructor(private field: string) {}

  describe(entity: string): string {
    return `There cannot be two instances of ${entity.toLowerCase()} with the same ${this.field.toLowerCase()}.`
  }
}
