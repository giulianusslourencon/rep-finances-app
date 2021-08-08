import { IErrorReason } from '@errors/contracts'

export class CustomReason implements IErrorReason {
  constructor(private reason: string) {}

  describe(_entity: string): string {
    return this.reason
  }
}
