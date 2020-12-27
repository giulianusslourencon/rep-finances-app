import { DomainError } from '@entities/errors/DomainError'

export class InvalidDateError extends Error implements DomainError {
  constructor(date: string) {
    super(`The date "${date}" is invalid.`)
    this.name = 'InvalidDateError'
  }
}
