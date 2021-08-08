import { InvalidError } from '@errors/contracts'

export interface IErrorHandler {
  addError(error: InvalidError, field: string): void
}
