import { Request, Response } from 'express'

import { CreateTransactionUseCase } from '@useCases/Transactions/CreateTransaction/CreateTransactionUseCase'
import { CreateTransactionValidation } from '@useCases/Transactions/CreateTransaction/CreateTransactionValidation'

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

      const transactionOrError = await this.createTransactionUseCase.execute({
        title,
        timestamp,
        items,
        payers
      })

      if (transactionOrError.isLeft()) {
        const { name, message } = transactionOrError.value
        return response.status(400).json({ name, message })
      }

      return response.status(201).json(transactionOrError.value)
    } catch (error) {
      return response.status(500).json({
        message: error.message || 'Unexpected error.'
      })
    }
  }
}
