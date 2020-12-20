import DomainError from '@entities/errors/DomainError'

export class InvalidAmountError extends Error implements DomainError {
  constructor(amount: string) {
    super(`The amount "${amount}" is invalid.`)
    this.name = 'InvalidAmountError'
  }
}
