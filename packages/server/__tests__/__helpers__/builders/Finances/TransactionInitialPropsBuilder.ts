import { TransactionInitProps } from '@entities/Finances'

import { CreateTransactionProps } from '@useCases/Finances/ports/CreateTransaction'

export class TransactionInitialPropsBuilder {
  private constructor(private transaction: CreateTransactionProps) {}

  static aTransaction = (): TransactionInitialPropsBuilder => {
    return new TransactionInitialPropsBuilder({
      items: {
        item: {
          related_users: ['P', 'D'],
          amount: 10
        }
      },
      payers: {
        P: 10
      },
      timestamp: 1608865200000,
      title: 'Vinho pra gay night de Natal'
    })
  }

  withInvalidTitle = (): TransactionInitialPropsBuilder => {
    this.transaction.title = 'A'
    return this
  }

  withInvalidTimestamp = (): TransactionInitialPropsBuilder => {
    this.transaction.timestamp = NaN
    return this
  }

  withInvalidItems = (): TransactionInitialPropsBuilder => {
    this.transaction.items.item.related_users[1] = '__'
    return this
  }

  withInvalidPayers = (): TransactionInitialPropsBuilder => {
    this.transaction.payers.P = -20
    return this
  }

  withInvalidPayment = (): TransactionInitialPropsBuilder => {
    this.transaction.payers.P = 20
    return this
  }

  build = (): CreateTransactionProps => {
    return this.transaction
  }

  buildWithId = (): TransactionInitProps => {
    return { ...this.transaction, id: 'id' }
  }
}
