import { InvalidTransactionPayersError } from '@entities/Finances/errors'

export class InvalidTransactionPayersDuplicateUser extends InvalidTransactionPayersError {
  constructor(duplicateUserId: string) {
    super(duplicateUserId, 'There cannot be two payers with the same id.')
  }
}
