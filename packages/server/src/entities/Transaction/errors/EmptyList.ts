import DomainError from '@entities/errors/DomainError'

export class EmptyListError extends Error implements DomainError {
  constructor() {
    super('List should contain at least one element.')
    this.name = 'EmptyListError'
  }
}
