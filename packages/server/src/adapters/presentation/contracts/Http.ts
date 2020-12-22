export interface HttpResponse<BodyType = unknown> {
  statusCode: number
  body: BodyType
}

export interface HttpRequest<
  BodyType = unknown,
  QueryType = unknown,
  ParamsType = unknown
> {
  body?: BodyType
  query?: QueryType
  params?: ParamsType
}
