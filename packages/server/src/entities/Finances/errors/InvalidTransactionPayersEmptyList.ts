import { InvalidTransactionPayersError } from '@entities/Finances/errors'

export class InvalidTransactionPayersEmptyList extends InvalidTransactionPayersError {
  constructor() {
    super('[]', 'There must be at least one payer.')
  }
}
