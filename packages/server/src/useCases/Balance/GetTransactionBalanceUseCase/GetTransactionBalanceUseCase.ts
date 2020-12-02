import { Balance } from '@entities/Balance'
import { IGetTransactionBalanceDTO } from './GetTransactionBalanceDTO'

export class GetTransactionBalanceUseCase {
  execute(props: IGetTransactionBalanceDTO) {
    const balance = new Balance(props.transaction)

    return balance
  }
}