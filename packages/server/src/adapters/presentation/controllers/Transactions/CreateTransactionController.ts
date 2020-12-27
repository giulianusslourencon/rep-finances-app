import { HttpRequest, HttpResponse } from '@presentation/contracts'
import { error, serverError, success } from '@presentation/controllers/helpers'
import { CreateTransactionValidation } from '@presentation/validators'
import {
  CreateTransactionViewModel,
  TransactionViewModel
} from '@presentation/viewModels'

import { CreateTransaction } from '@useCases/ports/Transactions'

export class CreateTransactionController {
  constructor(private createTransaction: CreateTransaction) {}

  async handle(
    request: HttpRequest<CreateTransactionViewModel>
  ): Promise<HttpResponse<TransactionViewModel>> {
    try {
      const validatedInputOrError = CreateTransactionValidation.validate(
        request
      )
      if (validatedInputOrError.isLeft())
        return error(validatedInputOrError.value, 406)

      const { title, timestamp, items, payers } = request.body

      const transactionOrError = await this.createTransaction.execute({
        title,
        timestamp,
        items,
        payers
      })

      if (transactionOrError.isLeft()) {
        return error(transactionOrError.value)
      }

      const transaction = transactionOrError.value

      return success(TransactionViewModel.map(transaction), 201)
    } catch (error) {
      return serverError(error.message)
    }
  }
}
