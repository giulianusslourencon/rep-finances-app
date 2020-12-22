import { DomainError } from '@entities/errors'

export class InvalidValueError extends Error implements DomainError {
  constructor() {
    super('Items values are distinct from total paid')
    this.name = 'InvalidValueError'
  }
}
