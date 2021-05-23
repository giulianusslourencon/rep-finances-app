import { HttpRequest, HttpResponse } from '@presentation/contracts'

export interface IControllerOperation {
  operate: (request: HttpRequest) => Promise<HttpResponse>
}
