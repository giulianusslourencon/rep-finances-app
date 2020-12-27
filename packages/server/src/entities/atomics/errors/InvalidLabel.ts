import { DomainError } from '@entities/errors/DomainError'

export class InvalidLabelError extends Error implements DomainError {
  constructor(label: string) {
    super(`The label "${label}" is invalid.`)
    this.name = 'InvalidLabelError'
  }
}
