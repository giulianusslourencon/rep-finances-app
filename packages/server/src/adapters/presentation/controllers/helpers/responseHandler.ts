import { HttpResponse } from '@presentation/contracts'
import { ServerError } from '@presentation/controllers/errors'
import { ErrorViewModel } from '@presentation/viewModels'

export const error = (
  error: Error,
  statusCode = 400
): HttpResponse<ErrorViewModel> => ({
  statusCode,
  body: { name: error.name, message: error.message }
})

export const success = <T = Record<string, never>>(
  data: T,
  statusCode = 200
): HttpResponse<T> => ({
  statusCode,
  body: data
})

export const serverError = (reason: string): HttpResponse<ErrorViewModel> =>
  error(new ServerError(reason || 'Unexpected error'), 500)
