import { InvalidError } from '@errors/contracts'

export type InvalidFields = {
  field: string
  error: InvalidError
}[]
