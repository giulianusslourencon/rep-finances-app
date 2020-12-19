import DomainError from '@entities/errors/DomainError'

export class InvalidTransactionItemsError extends Error implements DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidTransactionItemsError'
  }
}
