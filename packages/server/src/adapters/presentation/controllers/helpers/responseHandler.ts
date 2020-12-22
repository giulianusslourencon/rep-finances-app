import { ServerError } from '../errors/ServerError'
import { HttpResponse } from '../ports/http'

export const clientError = (error: Error, statusCode = 400): HttpResponse => ({
  statusCode,
  body: { name: error.name, message: error.message }
})

export const success = (data: unknown, statusCode = 200): HttpResponse => ({
  statusCode,
  body: data
})

export const serverError = (reason: string): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(reason)
})
