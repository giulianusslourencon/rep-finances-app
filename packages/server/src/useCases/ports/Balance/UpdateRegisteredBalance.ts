import { UseCase } from '@useCases/contracts'

export type UpdateRegisteredBalanceProps = undefined

export type UpdateRegisteredBalanceResponse = void

export type UpdateRegisteredBalance = UseCase<
  UpdateRegisteredBalanceProps,
  Promise<UpdateRegisteredBalanceResponse>
>
