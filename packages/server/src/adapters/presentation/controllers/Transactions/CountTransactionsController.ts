import { HttpRequest, HttpResponse } from '@presentation/contracts'
import { serverError, success } from '@presentation/controllers/helpers'
import { TransactionsCountViewModel } from '@presentation/viewModels'

import { CountTransactions } from '@useCases/ports/Transactions'

export class CountTransactionsController {
  constructor(private countTransactions: CountTransactions) {}

  async handle(
    request: HttpRequest<unknown, { month?: string }>
  ): Promise<HttpResponse<TransactionsCountViewModel>> {
    const { month } = request.query

    try {
      const transactionsCount = await this.countTransactions.execute({
        month
      })

      return success({ count: transactionsCount })
    } catch (error) {
      return serverError(error.message)
    }
  }
}
