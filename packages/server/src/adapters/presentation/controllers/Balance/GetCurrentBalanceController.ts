import { Controller, HttpRequest, HttpResponse } from '@presentation/contracts'
import { serverError, success } from '@presentation/controllers/helpers'

import { BalanceProps } from '@shared/@types/Balance'

import { GetCurrentBalanceUseCase } from '@useCases/Balance/GetCurrentBalanceUseCase/GetCurrentBalanceUseCase'

export class GetCurrentBalanceController implements Controller {
  // eslint-disable-next-line prettier/prettier
  constructor(private getCurrentBalanceUseCase: GetCurrentBalanceUseCase) { }

  async handle(_request: HttpRequest): Promise<HttpResponse<BalanceProps>> {
    try {
      const balance = await this.getCurrentBalanceUseCase.execute()

      return success({ balance: balance.individual_balance })
    } catch (error) {
      return serverError(error.message)
    }
  }
}
