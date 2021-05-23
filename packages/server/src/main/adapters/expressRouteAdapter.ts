import { RequestHandler } from 'express'

import { HttpRequest, IControllerOperation } from '@presentation/contracts'
import { Controller } from '@presentation/controllers'

export const adaptRoute = (operation: IControllerOperation): RequestHandler => {
  return async (req, res) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      query: req.query,
      params: req.params
    }
    const controller = new Controller(operation)
    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
