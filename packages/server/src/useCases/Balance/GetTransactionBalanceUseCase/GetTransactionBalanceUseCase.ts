import { Balance } from '@entities/Balance'

import { IGetTransactionBalanceDTO } from './GetTransactionBalanceDTO'

export class GetTransactionBalanceUseCase {
  execute(props: IGetTransactionBalanceDTO): Balance {
    const balance = new Balance(props.transaction)

    return balance
  }
}
