import { Request, Response } from 'express'

import { GetTransactionBalanceUseCase } from '@useCases/Balance/GetTransactionBalanceUseCase/GetTransactionBalanceUseCase'

import { TransactionNotFoundError } from '../errors/TransactionNotFound'
import { FindTransactionUseCase } from './FindTransactionUseCase'

export class FindTransactionController {
  /* eslint-disable prettier/prettier */
  constructor(
    private findTransactionUseCase: FindTransactionUseCase,
    private getTransactionBalanceUseCase: GetTransactionBalanceUseCase
  ) { }
  /* eslint-enable prettier/prettier */

  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    try {
      const transaction = await this.findTransactionUseCase.execute({ id })
      if (!transaction) {
        const { name, message } = new TransactionNotFoundError(id)
        return response.status(404).json({ name, message })
      }

      const balanceOrError = this.getTransactionBalanceUseCase.execute({
        transaction
      })
      if (balanceOrError.isLeft()) {
        const { name, message } = balanceOrError.value
        return response.status(400).json({ name, message })
      }

      return response
        .status(200)
        .json({ transaction, balance: balanceOrError.value.individual_balance })
    } catch (error) {
      return response.status(500).json({
        message: error.message || 'Unexpected error.'
      })
    }
  }
}
