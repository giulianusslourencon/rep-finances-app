import DomainError from '@entities/errors/DomainError'

export class InvalidTimestampError extends Error implements DomainError {
  constructor(timestamp: string) {
    super(`The timestamp "${timestamp}" is invalid.`)
    this.name = 'InvalidTimestampError'
  }
}
