import { RequestHandler } from 'express'

import { Controller, HttpRequest } from '@presentation/contracts'

export const adaptRoute = (controller: Controller): RequestHandler => {
  return async (req, res) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      query: req.query,
      params: req.params
    }
    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
