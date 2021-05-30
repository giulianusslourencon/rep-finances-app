import {
  HttpRequest,
  HttpResponse,
  IControllerOperation
} from '@presentation/contracts'
import { validate } from '@presentation/controllers/decorators'
import { ListTransactionsValidator } from '@presentation/controllers/Finances/validators'
import { success } from '@presentation/controllers/helpers'
import { ErrorViewModel } from '@presentation/viewModels'
import {
  ListQueryViewModel,
  TransactionResume,
  TransactionsArrayViewModel
} from '@presentation/viewModels/Finances'

import { ListTransactions } from '@useCases/Finances/ports/ListTransactions'

export class ListTransactionsControllerOperation
  implements IControllerOperation {
  constructor(private listTransactions: ListTransactions) {}

  @validate(new ListTransactionsValidator())
  async operate(
    request: HttpRequest<
      Record<string, never>,
      ListQueryViewModel,
      Record<string, never>
    >
  ): Promise<HttpResponse<TransactionsArrayViewModel | ErrorViewModel>> {
    const { page, nItems, month } = request.query

    const pageNumber = page || 1
    const itemsPerPage = nItems || 15

    const skipLimit = {
      limit: itemsPerPage,
      skip: (pageNumber - 1) * itemsPerPage
    }

    const transactions = await this.listTransactions.execute({
      skipLimit,
      month: <string>month
    })

    return success(TransactionResume.mapCollection(transactions))
  }
}
