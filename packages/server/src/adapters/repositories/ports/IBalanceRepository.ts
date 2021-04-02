import { CreateTransactionBalanceRepository } from '@useCases/Finances/ports/CreateTransaction'
import { GetCurrentBalanceBalanceRepository } from '@useCases/Finances/ports/GetCurrentBalance'
import { UpdateRegisteredBalanceBalanceRepository } from '@useCases/Finances/ports/UpdateRegisteredBalance'

export interface IBalanceRepository
  extends GetCurrentBalanceBalanceRepository,
    UpdateRegisteredBalanceBalanceRepository,
    CreateTransactionBalanceRepository {}
