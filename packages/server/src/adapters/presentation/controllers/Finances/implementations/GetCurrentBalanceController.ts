import { Controller, HttpRequest, HttpResponse } from '@presentation/contracts'
import { serverError, success } from '@presentation/controllers/helpers'
import { ErrorViewModel } from '@presentation/viewModels'
import { CurrentBalanceViewModel } from '@presentation/viewModels/Finances'

import { GetCurrentBalance } from '@useCases/Finances/ports/GetCurrentBalance'

export class GetCurrentBalanceController implements Controller {
  constructor(private getCurrentBalance: GetCurrentBalance) {}

  async handle(
    _request: HttpRequest
  ): Promise<HttpResponse<CurrentBalanceViewModel | ErrorViewModel>> {
    try {
      const balance = await this.getCurrentBalance.execute(undefined)

      return success(CurrentBalanceViewModel.map(balance))
    } catch (error) {
      return serverError(error.message)
    }
  }
}