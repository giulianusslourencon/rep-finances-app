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

  build = (): CreateTransactionProps => {
    return this.transaction
  }
}
