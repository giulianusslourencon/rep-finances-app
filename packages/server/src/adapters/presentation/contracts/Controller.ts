import {
  HttpRequest,
  HttpResponse,
  IControllerOperation
} from '@presentation/contracts'
import {
  invalidInputError,
  serverError
} from '@presentation/controllers/helpers'

export class Controller {
  constructor(private controllerOp: IControllerOperation) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = this.controllerOp.validator.validate(request)
      if (validationResult.isLeft())
        return invalidInputError(validationResult.value)

      return await this.controllerOp.operate(validationResult.value)
    } catch (error) {
      return serverError(error.message)
    }
  }
}
