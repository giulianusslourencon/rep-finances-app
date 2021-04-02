import { TransactionProps } from '@entities/Finances'

export class TransactionBuilder {
  private constructor(private transaction: TransactionProps) {}

  static aTransaction = (): TransactionBuilder => {
    return new TransactionBuilder({
      items: {
        item: {
          related_users: ['P', 'D'],
          amount: 10
        }
      },
      payers: {
        P: 10
      },
      date: new Date(1608865200000),
      title: 'Vinho pra gay night de Natal',
      _id: 'idzada',
      amount: 10,
      month: '202012',
      related: ['P', 'D']
    })
  }

  build = (): TransactionProps => {
    return this.transaction
  }
}
