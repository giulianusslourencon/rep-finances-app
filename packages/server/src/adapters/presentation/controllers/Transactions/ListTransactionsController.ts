import { Controller, HttpRequest, HttpResponse } from '@presentation/contracts'

import { ListTransactionsUseCase } from '@useCases/Transactions/ListTransactions/ListTransactionsUseCase'

export class ListTransactionsController implements Controller {
  // eslint-disable-next-line prettier/prettier
  constructor(private listTransactionsUseCase: ListTransactionsUseCase) { }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { skip, limit, month } = request.query

    const skipNumber = parseInt(<string>skip)
    const limitNumber = parseInt(<string>limit)

    try {
      const skipLimit =
        skip && limit ? { skip: skipNumber, limit: limitNumber } : undefined

      const transactions = await this.listTransactionsUseCase.execute({
        skipLimit,
        month: <string>month
      })

      return response.status(200).json(transactions)
    } catch (error) {
      return response.status(500).json({
        message: error.message || 'Unexpected error.'
      })
    }
  }
}
