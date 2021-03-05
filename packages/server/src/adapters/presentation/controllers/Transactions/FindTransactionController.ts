import { HttpRequest, HttpResponse } from '@presentation/contracts'
import { error, serverError, success } from '@presentation/controllers/helpers'
import { TransactionDetailsViewModel } from '@presentation/viewModels'

import { GetTransactionBalance } from '@useCases/Balance/ports/GetTransactionBalance'
import { FindTransaction } from '@useCases/Transactions/ports/FindTransaction'

export class FindTransactionController {
  constructor(
    private findTransaction: FindTransaction,
    private getTransactionBalance: GetTransactionBalance
  ) {}

  async handle(
    request: HttpRequest<unknown, unknown, { id: string }>
  ): Promise<HttpResponse<TransactionDetailsViewModel>> {
    const { id } = request.params

    try {
      const transactionOrError = await this.findTransaction.execute({ id })
      if (transactionOrError.isLeft()) {
        return error(transactionOrError.value, 404)
      }

      const transaction = transactionOrError.value

      const balanceOrError = await this.getTransactionBalance.execute({
        transaction
      })
      if (balanceOrError.isLeft()) {
        return error(balanceOrError.value)
      }

      const balance = balanceOrError.value

      return success(TransactionDetailsViewModel.map(transaction, balance))
    } catch (error) {
      return serverError(error.message)
    }
  }
}
