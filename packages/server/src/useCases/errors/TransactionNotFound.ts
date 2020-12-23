import { UseCaseError } from '@useCases/errors'

export class TransactionNotFoundError extends Error implements UseCaseError {
  constructor(transactionId: string) {
    super(`Transaction with id "${transactionId}" not found`)
    this.name = 'TransactionNotFoundError'
  }
}
