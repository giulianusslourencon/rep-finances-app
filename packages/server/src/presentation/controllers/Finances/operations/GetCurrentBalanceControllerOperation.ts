import {
  HttpRequest,
  HttpResponse,
  IControllerOperation
} from '@presentation/contracts'
import { success } from '@presentation/controllers/helpers'
import { ErrorViewModel } from '@presentation/viewModels'
import { CurrentBalanceViewModel } from '@presentation/viewModels/Finances'

import { GetCurrentBalance } from '@useCases/Finances/ports/GetCurrentBalance'

export class GetCurrentBalanceControllerOperation
  implements IControllerOperation {
  constructor(private getCurrentBalance: GetCurrentBalance) {}

  async operate(
    _request: HttpRequest
  ): Promise<HttpResponse<CurrentBalanceViewModel | ErrorViewModel>> {
    const balance = await this.getCurrentBalance.execute(undefined)

    return success(CurrentBalanceViewModel.map(balance))
  }
}
