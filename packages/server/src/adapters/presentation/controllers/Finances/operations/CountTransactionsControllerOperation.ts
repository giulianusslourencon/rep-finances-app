import {
  HttpRequest,
  HttpResponse,
  IControllerOperation,
  IValidator
} from '@presentation/contracts'
import { success } from '@presentation/controllers/helpers'
import { ValidatorDummie } from '@presentation/validators'
import { ErrorViewModel } from '@presentation/viewModels'
import { TransactionsCountViewModel } from '@presentation/viewModels/Finances'

import { CountTransactions } from '@useCases/Finances/ports/CountTransactions'

export class CountTransactionsControllerOperation
  implements IControllerOperation {
  validator: IValidator
  constructor(private countTransactions: CountTransactions) {
    this.validator = new ValidatorDummie()
  }

  async operate(
    request: HttpRequest<
      Record<string, never>,
      { month?: string },
      Record<string, never>
    >
  ): Promise<HttpResponse<TransactionsCountViewModel | ErrorViewModel>> {
    const { month } = request.query

    const transactionsCount = await this.countTransactions.execute({
      month
    })

    return success({ count: transactionsCount })
  }
}
