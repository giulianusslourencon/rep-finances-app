/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HttpResponse<BodyType = any> {
  statusCode: number
  body: BodyType
}

export interface HttpRequest<
  BodyType = any,
  QueryType = any,
  ParamsType = any
> {
  body: BodyType
  query: QueryType
  params: ParamsType
}
