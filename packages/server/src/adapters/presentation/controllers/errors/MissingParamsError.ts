import { ControllerError } from './ControllerError'

export class MissingParamsError implements ControllerError {
  name: string
  errors: { message: string; field?: string }[]

  constructor(paramsNames: string[]) {
    this.name = 'MissingParamsError'
    this.errors = paramsNames.map(param => ({
      field: param.split(' ')[0],
      message: `Missing param: ${param}`
    }))
  }
}
