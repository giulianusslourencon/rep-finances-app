import {
  HttpRequest,
  HttpResponse,
  IControllerOperation,
  IValidator
} from '@presentation/contracts'
import {
  invalidFieldsError,
  notFoundError,
  success
} from '@presentation/controllers/helpers'
import { ValidatorDummie } from '@presentation/validators'
import { ErrorViewModel } from '@presentation/viewModels'
import { TransactionDetailsViewModel } from '@presentation/viewModels/Finances'

import { FindTransaction } from '@useCases/Finances/ports/FindTransaction'
import { GetTransactionBalance } from '@useCases/Finances/ports/GetTransactionBalance'

export class FindTransactionControllerOperation
  implements IControllerOperation {
  validator: IValidator
  constructor(
    private findTransaction: FindTransaction,
    private getTransactionBalance: GetTransactionBalance
  ) {
    this.validator = new ValidatorDummie()
  }

  async operate(
    request: HttpRequest<
      Record<string, never>,
      Record<string, never>,
      { id: string }
    >
  ): Promise<HttpResponse<TransactionDetailsViewModel | ErrorViewModel>> {
    const { id } = request.params

    const transactionOrError = await this.findTransaction.execute({ id })
    if (transactionOrError.isLeft()) {
      return notFoundError(transactionOrError.value)
    }

    const transaction = transactionOrError.value

    const balanceOrError = await this.getTransactionBalance.execute({
      transaction
    })
    if (balanceOrError.isLeft()) {
      return invalidFieldsError(balanceOrError.value)
    }

    const balance = balanceOrError.value

    return success(TransactionDetailsViewModel.map(transaction, balance))
  }
}
