import { Controller, HttpRequest, HttpResponse } from '@presentation/contracts'
import { serverError, success } from '@presentation/controllers/helpers'
import { TransactionsArrayViewModel } from '@presentation/viewModels'

import { ListTransactions } from '@useCases/ports/Transactions'

export class ListTransactionsController implements Controller {
  constructor(private listTransactions: ListTransactions) {}

  async handle(
    request: HttpRequest<
      unknown,
      { skip?: string; limit?: string; month?: string }
    >
  ): Promise<HttpResponse<TransactionsArrayViewModel>> {
    const { skip, limit, month } = request.query

    const skipNumber = parseInt(<string>skip)
    const limitNumber = parseInt(<string>limit)

    try {
      const skipLimit =
        !isNaN(skipNumber) && !isNaN(limitNumber)
          ? { skip: skipNumber, limit: limitNumber }
          : undefined

      const transactions = await this.listTransactions.execute({
        skipLimit,
        month: <string>month
      })

      return success(transactions)
    } catch (error) {
      return serverError(error.message)
    }
  }
}
