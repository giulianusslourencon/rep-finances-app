import { IErrorReason } from '@entities/errors'

export class SizeReason implements IErrorReason {
  constructor(private min: number, private max: number) {}

  describe(entity: string): string {
    return `The ${entity.toLowerCase()} must contain between ${this.min} and ${
      this.max
    } characteres.`
  }
}
