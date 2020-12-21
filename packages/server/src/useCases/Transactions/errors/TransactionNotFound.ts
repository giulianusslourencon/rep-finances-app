import UseCaseError from '../../errors/UseCaseError'

export class TransactionNotFoundError extends Error implements UseCaseError {
  constructor(transactionId: string) {
    super(`Transaction with id "${transactionId}" not found`)
    this.name = 'TransactionNotFoundError'
  }
}
