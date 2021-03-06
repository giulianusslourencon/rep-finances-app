import { Controller, HttpRequest, HttpResponse } from '@presentation/contracts'
import { serverError, success } from '@presentation/controllers/helpers'
import {
  CurrentBalanceViewModel,
  ErrorViewModel
} from '@presentation/viewModels'

import { GetCurrentBalance } from '@useCases/Balance/ports/GetCurrentBalance'

export class GetCurrentBalanceController implements Controller {
  constructor(private getCurrentBalance: GetCurrentBalance) {}

  async handle(
    _: HttpRequest
  ): Promise<HttpResponse<CurrentBalanceViewModel | ErrorViewModel>> {
    try {
      const balance = await this.getCurrentBalance.execute(undefined)

      return success(CurrentBalanceViewModel.map(balance))
    } catch (error) {
      return serverError(error.message)
    }
  }
}
