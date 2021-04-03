import { HttpRequest, HttpResponse } from '@presentation/contracts'
import { CreateTransactionValidation } from '@presentation/controllers/Finances/validators'
import {
  invalidFieldsError,
  missingParamsError,
  serverError,
  success
} from '@presentation/controllers/helpers'
import { ErrorViewModel } from '@presentation/viewModels'
import {
  CreateTransactionViewModel,
  TransactionViewModel
} from '@presentation/viewModels/Finances'

import { CreateTransaction } from '@useCases/Finances/ports/CreateTransaction'

export class CreateTransactionController {
  constructor(private createTransaction: CreateTransaction) {}

  async handle(
    request: HttpRequest<
      CreateTransactionViewModel,
      Record<string, never>,
      Record<string, never>
    >
  ): Promise<HttpResponse<TransactionViewModel | ErrorViewModel>> {
    try {
      const validatedInputOrError = CreateTransactionValidation.validate(
        request
      )
      if (validatedInputOrError.isLeft())
        return missingParamsError(validatedInputOrError.value)

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
    } catch (error) {
      return serverError(error.message)
    }
  }
}
