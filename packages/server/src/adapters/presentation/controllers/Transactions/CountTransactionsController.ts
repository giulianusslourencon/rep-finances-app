import { HttpRequest, HttpResponse } from '@presentation/contracts'
import { serverError, success } from '@presentation/controllers/helpers'
import {
  ErrorViewModel,
  TransactionsCountViewModel
} from '@presentation/viewModels'

import { CountTransactions } from '@useCases/Transactions/ports/CountTransactions'

export class CountTransactionsController {
  constructor(private countTransactions: CountTransactions) {}

  async handle(
    request: HttpRequest<
      Record<string, never>,
      { month?: string },
      Record<string, never>
    >
  ): Promise<HttpResponse<TransactionsCountViewModel | ErrorViewModel>> {
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
