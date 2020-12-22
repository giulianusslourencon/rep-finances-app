export interface HttpResponse {
  statusCode: number
  body: unknown
}

export interface HttpRequest {
  body?: unknown
  query?: unknown
  params?: unknown
}
