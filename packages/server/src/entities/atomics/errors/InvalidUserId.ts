import { DomainError } from '@entities/errors/DomainError'

export class InvalidUserIdError extends Error implements DomainError {
  constructor(userId: string) {
    super(`User "${userId}" is invalid.`)
    this.name = 'InvalidUserIdError'
  }
}
