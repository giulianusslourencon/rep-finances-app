import { Request, Response } from 'express'

import { GetTransactionBalanceUseCase } from '@useCases/Balance/GetTransactionBalanceUseCase/GetTransactionBalanceUseCase'

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
      if (!transaction) throw new Error('Transaction not found')

      const balance = this.getTransactionBalanceUseCase.execute({ transaction })

      return response
        .status(200)
        .json({ transaction, balance: balance.individual_balance })
    } catch (error) {
      return response.status(404).json({
        message: error.message || 'Unexpected error.'
      })
    }
  }
}
