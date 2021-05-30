import {
  HttpRequest,
  HttpResponse,
  IControllerOperation
} from '@presentation/contracts'
import { validate } from '@presentation/controllers/decorators'
import { CreateTransactionValidator } from '@presentation/controllers/Finances/validators'
import { invalidFieldsError, success } from '@presentation/controllers/helpers'
import { ErrorViewModel } from '@presentation/viewModels'
import {
  CreateTransactionViewModel,
  TransactionViewModel
} from '@presentation/viewModels/Finances'

import { CreateTransaction } from '@useCases/Finances/ports/CreateTransaction'

export class CreateTransactionControllerOperation
  implements IControllerOperation {
  constructor(private createTransaction: CreateTransaction) {}

  @validate(new CreateTransactionValidator())
  async operate(
    request: HttpRequest<
      CreateTransactionViewModel,
      Record<string, never>,
      Record<string, never>
    >
  ): Promise<HttpResponse<TransactionViewModel | ErrorViewModel>> {
    const { title, timestamp, items, payers } = request.body

    const transactionOrError = await this.createTransaction.execute({
      title,
      timestamp,
      items,
      payers
    })

    if (transactionOrError.isLeft()) {
      return invalidFieldsError(transactionOrError.value)
    }

    const transaction = transactionOrError.value

    return success(TransactionViewModel.map(transaction), 201)
  }
}
