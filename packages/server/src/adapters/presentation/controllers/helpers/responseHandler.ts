import { HttpResponse } from '@presentation/contracts'
import {
  InvalidInputError,
  ServerError
} from '@presentation/controllers/errors'
import { ErrorViewModel } from '@presentation/viewModels'

import { InvalidFields } from '@entities/errors'

import { NotFoundError } from '@useCases/errors'

export const success = <T = Record<string, never>>(
  data: T,
  statusCode = 200
): HttpResponse<T> => ({
  statusCode,
  body: data
})

export const invalidInputError = (
  error: InvalidInputError
): HttpResponse<ErrorViewModel> => ({
  statusCode: 400,
  body: error
})

export const notFoundError = (
  error: NotFoundError
): HttpResponse<ErrorViewModel> => ({
  statusCode: 404,
  body: {
    name: error.name,
    errors: [{ field: error.key, message: error.message }]
  }
})

export const invalidFieldsError = (
  error: InvalidFields
): HttpResponse<ErrorViewModel> => ({
  statusCode: 406,
  body: {
    name: 'InvalidFieldsError',
    errors: error.map(err => ({
      field: err.field,
      message: err.error.reason
    }))
  }
})

export const serverError = (reason?: string): HttpResponse<ErrorViewModel> => ({
  statusCode: 500,
  body: new ServerError(reason || 'Unexpected error')
})
