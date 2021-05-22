/* eslint-disable @typescript-eslint/ban-types */
import { HttpRequest } from '@presentation/contracts'

export class HttpRequestBuilder {
  private constructor(private httpRequest: HttpRequest) {}

  static anHttpRequest = (): HttpRequestBuilder => {
    return new HttpRequestBuilder({
      body: {},
      params: {},
      query: {}
    })
  }

  public withBody = (body: object): HttpRequestBuilder => {
    this.httpRequest.body = body
    return this
  }

  public withParams = (params: object): HttpRequestBuilder => {
    this.httpRequest.params = params
    return this
  }

  public withQuery = (query: object): HttpRequestBuilder => {
    this.httpRequest.query = query
    return this
  }

  public build = (): HttpRequest => {
    return this.httpRequest
  }
}
