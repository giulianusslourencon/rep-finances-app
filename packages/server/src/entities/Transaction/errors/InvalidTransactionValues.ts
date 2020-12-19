import DomainError from '@entities/errors/DomainError'

export class InvalidTransactionValuesError
  extends Error
  implements DomainError {
  constructor() {
    super('Items values are distinct from total paid')
    this.name = 'InvalidTransactionValuesError'
  }
}
