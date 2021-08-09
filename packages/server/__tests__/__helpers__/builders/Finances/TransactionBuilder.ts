import {
  TransactionProps,
  TransactionFullInfo,
  Transaction,
  TransactionItems,
  TransactionPayers
} from '@entities/Finances'

export class TransactionBuilder {
  private constructor(private transaction: TransactionFullInfo) {}

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
      id: 'id',
      amount: 10,
      month: '202012',
      related: ['P', 'D']
    })
  }

  withInvalidTitle = (): TransactionBuilder => {
    this.transaction.title = 'A'
    return this
  }

  withInvalidDate = (): TransactionBuilder => {
    this.transaction.date = new Date('aaa')
    return this
  }

  withInvalidItems = (): TransactionBuilder => {
    this.transaction.items.item.related_users[1] = '__'
    return this
  }

  withInvalidPayers = (): TransactionBuilder => {
    this.transaction.payers.P = -20
    return this
  }

  withInvalidPayment = (): TransactionBuilder => {
    this.transaction.payers.P = 20
    return this
  }

  build = (): Transaction => {
    return new Transaction(
      this.transaction.id,
      this.transaction.title,
      this.transaction.date,
      new TransactionItems(this.transaction.items),
      new TransactionPayers(this.transaction.payers)
    )
  }

  buildInitialProps = (): TransactionProps => {
    return {
      id: this.transaction.id,
      title: this.transaction.title,
      date: this.transaction.date,
      items: this.transaction.items,
      payers: this.transaction.payers
    }
  }

  buildFullInfo = (): TransactionFullInfo => {
    return this.transaction
  }
}
