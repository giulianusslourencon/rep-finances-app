import { DomainError } from '@entities/errors/DomainError'

export class InvalidRelatedError extends Error implements DomainError {
  constructor(related: string) {
    super(`User "${related}" is invalid.`)
    this.name = 'InvalidRelatedError'
  }
}
