import { HttpResponse } from '../../contracts'
import { ServerError } from '../errors'

export const error = (error: Error, statusCode = 400): HttpResponse => ({
  statusCode,
  body: { name: error.name, message: error.message }
})

export const success = <T = unknown>(
  data: T,
  statusCode = 200
): HttpResponse<T> => ({
  statusCode,
  body: data
})

export const serverError = (reason: string): HttpResponse =>
  error(new ServerError(reason || 'Unexpected error'), 500)
