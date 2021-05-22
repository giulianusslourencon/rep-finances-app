import {
  HttpRequest,
  HttpResponse,
  IControllerOperation,
  IValidator
} from '@presentation/contracts'
import { success } from '@presentation/controllers/helpers'
import { ValidatorDummie } from '@presentation/controllers/validators'
import { ErrorViewModel } from '@presentation/viewModels'
import { CurrentBalanceViewModel } from '@presentation/viewModels/Finances'

import { GetCurrentBalance } from '@useCases/Finances/ports/GetCurrentBalance'

export class GetCurrentBalanceControllerOperation
  implements IControllerOperation {
  validator: IValidator
  constructor(private getCurrentBalance: GetCurrentBalance) {
    this.validator = new ValidatorDummie()
  }

  async operate(
    _request: HttpRequest
  ): Promise<HttpResponse<CurrentBalanceViewModel | ErrorViewModel>> {
    const balance = await this.getCurrentBalance.execute(undefined)

    return success(CurrentBalanceViewModel.map(balance))
  }
}
