import { IErrorReason } from '@errors/contracts'

export class PositiveNumberReason implements IErrorReason {
  describe(entity: string): string {
    return `The ${entity.toLowerCase()} must be a positive number.`
  }
}
