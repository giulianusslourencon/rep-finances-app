import { Request, Response } from 'express'
import { ListTransactionsUseCase } from './ListTransactionsUseCase'

export class ListTransactionsController {
  constructor(
    private listTransactionsUseCase: ListTransactionsUseCase
  ) { }

  async handle(request: Request, response: Response): Promise<Response> {
    const { skip, limit, month } = request.query

    try {
      const skipLimit = (skip && limit) 
        ? {
            skip: parseInt(<string>skip), 
            limit: parseInt(<string>limit)
          } 
        : undefined

      const transactions = await this.listTransactionsUseCase.execute({ skipLimit, month: <string>month })

      return response.status(200).json(transactions)
    } catch (error) {
      return response.status(400).json({
        message: error.message || 'Unexpected error.'
      })
    }
  }
}