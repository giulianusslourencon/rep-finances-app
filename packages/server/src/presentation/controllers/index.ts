import {
  HttpRequest,
  HttpResponse,
  IControllerOperation
} from '@presentation/contracts'
import { serverError } from '@presentation/controllers/helpers'

export class Controller {
  constructor(private controllerOp: IControllerOperation) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      return await this.controllerOp.operate(request)
    } catch (error) {
      return serverError(error.message)
    }
  }
}
