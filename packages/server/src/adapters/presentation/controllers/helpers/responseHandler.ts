import { HttpResponse } from '../../contracts'
import { ServerError } from '../errors'

export const clientError = (
  error: Error,
  statusCode = 400
): HttpResponse<{ name: string; message: string }> => ({
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

export const serverError = (
  reason = 'Unexpected error'
): HttpResponse<ServerError> => ({
  statusCode: 500,
  body: new ServerError(reason)
})
