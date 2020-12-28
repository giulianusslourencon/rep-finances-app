import { DomainError } from '@entities/errors'

export class DuplicatedUserIdOnListError extends Error implements DomainError {
  constructor(userId: string) {
    super(`User id ${userId} is duplicated.`)
    this.name = 'DuplicatedUserIdOnListError'
  }
}
