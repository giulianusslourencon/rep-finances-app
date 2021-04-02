import { IErrorReason } from '@entities/errors'

export class EmptyReason implements IErrorReason {
  describe(entity: string): string {
    return `There must be at least one item in the ${entity.toLowerCase()}.`
  }
}
