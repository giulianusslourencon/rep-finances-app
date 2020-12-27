import { DomainError } from '@entities/errors'

export class InvalidPaymentError extends Error implements DomainError {
  constructor() {
    super('Items values are distinct from total paid')
    this.name = 'InvalidPaymentError'
  }
}
