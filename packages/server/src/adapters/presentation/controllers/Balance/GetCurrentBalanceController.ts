import { Controller, HttpRequest, HttpResponse } from '@presentation/contracts'
import { serverError, success } from '@presentation/controllers/helpers'
import { CurrentBalanceViewModel } from '@presentation/viewModels'

import { GetCurrentBalance } from '@useCases/ports/Balance'

export class GetCurrentBalanceController implements Controller {
  constructor(private getCurrentBalance: GetCurrentBalance) {}

  async handle(_: HttpRequest): Promise<HttpResponse<CurrentBalanceViewModel>> {
    try {
      const balance = await this.getCurrentBalance.execute(undefined)

      return success({ balance: balance.individual_balance })
    } catch (error) {
      return serverError(error.message)
    }
  }
}
