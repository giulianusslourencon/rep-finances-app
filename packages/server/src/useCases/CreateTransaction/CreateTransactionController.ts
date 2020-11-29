import { Request, Response } from "express"
import { CreateTransactionUseCase } from "./CreateTransactionUseCase"

export class CreateTransactionController {
  constructor(
    private createTransactionUseCase: CreateTransactionUseCase
  ) {}
  
  async handle(request: Request, response: Response): Promise<Response> {
    const { title, timestamp, items, payers } = request.body

    try {
      await this.createTransactionUseCase.execute({
        title, timestamp, items, payers
      })

      return response.status(201).send()
    } catch (error) {
      return response.status(400).json({
        message: error.message || 'Unexpected error.'
      })
    }
  }
}