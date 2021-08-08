import { IErrorReason } from '@errors/contracts'

export class DuplicateReason implements IErrorReason {
  constructor(private field: string) {}

  describe(entity: string): string {
    return `There cannot be two items in the ${entity.toLowerCase()} with the same ${this.field.toLowerCase()}.`
  }
}
