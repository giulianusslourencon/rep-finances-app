import { HttpRequest, HttpResponse, IValidator } from '@presentation/contracts'

export interface IControllerOperation {
  validator: IValidator
  operate: (request: HttpRequest) => Promise<HttpResponse>
}
