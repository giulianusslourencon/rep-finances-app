import { ControllerError } from './ControllerError'

export class InvalidInputError implements ControllerError {
  name: string
  errors: { message: string; field?: string }[]

  constructor(paramReasons: string[]) {
    this.name = 'InvalidInputError'
    this.errors = paramReasons.map(reason => ({
      field: reason.split(' ')[0],
      message: `Invalid input: ${reason}`
    }))
  }
}
