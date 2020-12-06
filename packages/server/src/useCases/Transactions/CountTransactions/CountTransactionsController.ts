import { Request, Response } from 'express'

import { CountTransactionsUseCase } from './CountTransactionsUseCase'

export class CountTransactionsController {
  // eslint-disable-next-line prettier/prettier
  constructor(private countTransactionsUseCase: CountTransactionsUseCase) { }

  async handle(request: Request, response: Response): Promise<Response> {
    const { month } = request.query

    try {
      const transactionsCount = await this.countTransactionsUseCase.execute({
        month: <string>month
      })

      return response.status(200).json({ count: transactionsCount })
    } catch (error) {
      return response.status(400).json({
        message: error.message || 'Unexpected error.'
      })
    }
  }
}
