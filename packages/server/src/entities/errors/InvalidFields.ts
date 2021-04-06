import { InvalidError } from '@entities/errors'

export type InvalidFields = {
  field?: string
  error: InvalidError
}[]
