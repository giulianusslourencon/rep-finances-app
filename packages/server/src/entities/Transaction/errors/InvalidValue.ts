import { DomainError } from '@entities/errors/DomainError'

export class InvalidValueError extends Error implements DomainError {
  constructor() {
    super('Items values are distinct from total paid')
    this.name = 'InvalidValueError'
  }
}
