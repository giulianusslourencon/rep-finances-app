import { IErrorReason } from '@errors/contracts'

export class EmptyReason implements IErrorReason {
  describe(entity: string): string {
    return `There must be at least one item in the ${entity.toLowerCase()}.`
  }
}
