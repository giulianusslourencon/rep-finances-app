import { Request, Response } from 'express'

import { GetCurrentBalanceUseCase } from '@useCases/Balance/GetCurrentBalanceUseCase/GetCurrentBalanceUseCase'

export class GetCurrentBalanceController {
  // eslint-disable-next-line prettier/prettier
  constructor(private getCurrentBalanceUseCase: GetCurrentBalanceUseCase) { }

  async handle(_request: Request, response: Response): Promise<Response> {
    try {
      const balance = await this.getCurrentBalanceUseCase.execute()

      return response.json({ balance: balance.individual_balance })
    } catch (error) {
      return response.status(500).json({
        message: error.message || 'Unexpected error.'
      })
    }
  }
}
