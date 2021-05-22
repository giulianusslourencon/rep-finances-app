import { ControllerError } from './ControllerError'

export class ServerError implements ControllerError {
  name: string
  errors: { message: string; field?: string }[]
  constructor(reason: string) {
    this.name = 'ServerError'
    this.errors = [{ message: `Server error: ${reason}.` }]
  }
}
