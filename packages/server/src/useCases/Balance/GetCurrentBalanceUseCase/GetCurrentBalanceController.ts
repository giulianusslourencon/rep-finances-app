import { Request, Response } from 'express'
import { GetCurrentBalanceUseCase } from './GetCurrentBalanceUseCase'

export class GetCurrentBalanceController {
  constructor(
    private getCurrentBalanceUseCase: GetCurrentBalanceUseCase
  ) {}

  async handle(_request: Request, response: Response): Promise<Response> {
    try {
      const balance = await this.getCurrentBalanceUseCase.execute()

      return response.json({ balance: balance.individual_balance })
    } catch (error) {
      return response.status(400).json({
        message: error.message || 'Unexpected error.'
      })
    }
  }
}