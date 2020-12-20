import { Request, Response } from 'express'

import { CreateTransactionUseCase } from './CreateTransactionUseCase'
import { CreateTransactionValidation } from './CreateTransactionValidation'

export class CreateTransactionController {
  /* eslint-disable prettier/prettier */
  constructor(
    private createTransactionUseCase: CreateTransactionUseCase,
    private createTransactionValidation: CreateTransactionValidation
  ) { }
  /* eslint-enable prettier/prettier */

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      if (!this.createTransactionValidation.validate(request))
        return response.status(406).json({ message: 'Missing field.' })

      const { title, timestamp, items, payers } = request.body

      const transaction = await this.createTransactionUseCase.execute({
        title,
        timestamp,
        items,
        payers
      })

      return response.status(201).json(transaction)
    } catch (error) {
      return response.status(500).json({
        message: error.message || 'Unexpected error.'
      })
    }
  }
}
