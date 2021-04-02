import { CountTransactionsTransactionsRepository } from '@useCases/Finances/ports/CountTransactions'
import { CreateTransactionTransactionsRepository } from '@useCases/Finances/ports/CreateTransaction'
import { FindTransactionTransactionsRepository } from '@useCases/Finances/ports/FindTransaction'
import { ListTransactionsTransactionsRepository } from '@useCases/Finances/ports/ListTransactions'
import { UpdateRegisteredBalanceTransactionsRepository } from '@useCases/Finances/ports/UpdateRegisteredBalance'

export interface ITransactionsRepository
  extends CountTransactionsTransactionsRepository,
    CreateTransactionTransactionsRepository,
    FindTransactionTransactionsRepository,
    ListTransactionsTransactionsRepository,
    UpdateRegisteredBalanceTransactionsRepository {}
