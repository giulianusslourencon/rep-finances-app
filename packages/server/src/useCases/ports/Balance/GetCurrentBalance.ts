import { BalanceProps } from '@entities/Balance'

import { UseCase } from '@useCases/contracts'

export type GetCurrentBalanceProps = undefined

export type GetCurrentBalanceResponse = BalanceProps

export type GetCurrentBalance = UseCase<
  GetCurrentBalanceProps,
  Promise<GetCurrentBalanceResponse>
>
