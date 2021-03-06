import { Controller, HttpRequest, HttpResponse } from '@presentation/contracts'
import { error, serverError, success } from '@presentation/controllers/helpers'
import { ListTransactionsValidation } from '@presentation/validators'
import {
  ErrorViewModel,
  ListQueryViewModel,
  TransactionResume,
  TransactionsArrayViewModel
} from '@presentation/viewModels'

import { ListTransactions } from '@useCases/Transactions/ports/ListTransactions'

export class ListTransactionsController implements Controller {
  constructor(private listTransactions: ListTransactions) {}

  async handle(
    request: HttpRequest<
      Record<string, never>,
      ListQueryViewModel,
      Record<string, never>
    >
  ): Promise<HttpResponse<TransactionsArrayViewModel | ErrorViewModel>> {
    const validatedInputOrError = ListTransactionsValidation.validate(request)
    if (validatedInputOrError.isLeft())
      return error(validatedInputOrError.value, 406)

    const { page, nItems, month } = request.query

    const pageNumber = page || 1
    const itemsPerPage = nItems || 15

    try {
      const skipLimit = {
        limit: itemsPerPage,
        skip: (pageNumber - 1) * itemsPerPage
      }

      const transactions = await this.listTransactions.execute({
        skipLimit,
        month: <string>month
      })

      return success(TransactionResume.mapCollection(transactions))
    } catch (error) {
      return serverError(error.message)
    }
  }
}
