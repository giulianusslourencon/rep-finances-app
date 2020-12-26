import { RequestHandler } from 'express'

export const contentType: RequestHandler = (req, res, next) => {
  res.type('json')
  next()
}
