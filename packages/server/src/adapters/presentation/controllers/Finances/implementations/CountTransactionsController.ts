import { HttpRequest, HttpResponse } from '@presentation/contracts'
import { serverError, success } from '@presentation/controllers/helpers'
import { ErrorViewModel } from '@presentation/viewModels'
import { TransactionsCountViewModel } from '@presentation/viewModels/Finances'

import { CountTransactions } from '@useCases/Finances/ports/CountTransactions'

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
