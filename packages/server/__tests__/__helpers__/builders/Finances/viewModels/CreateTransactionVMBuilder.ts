/* eslint-disable @typescript-eslint/no-explicit-any */
export class CreateTransactionVMBuilder {
  private constructor(private transaction: any) {}

  static aTransaction = (): CreateTransactionVMBuilder => {
    return new CreateTransactionVMBuilder({
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

  public withoutTitle = (): CreateTransactionVMBuilder => {
    delete this.transaction.title
    return this
  }

  public withTitleAsNotAString = (): CreateTransactionVMBuilder => {
    this.transaction.title = {}
    return this
  }

  public withoutTimestamp = (): CreateTransactionVMBuilder => {
    delete this.transaction.timestamp
    return this
  }

  public withTimestampAsNotANumber = (): CreateTransactionVMBuilder => {
    this.transaction.timestamp = false
    return this
  }

  public withoutItems = (): CreateTransactionVMBuilder => {
    delete this.transaction.items
    return this
  }

  public withItemsAsAnArray = (): CreateTransactionVMBuilder => {
    this.transaction.items = [{ amount: 2, related_users: ['P'] }]
    return this
  }

  public withItemsAsAString = (): CreateTransactionVMBuilder => {
    this.transaction.items = 'items'
    return this
  }

  public withItemsAsNotAnObject = (): CreateTransactionVMBuilder => {
    this.transaction.items = true
    return this
  }

  public withItemsAsAnEmptyObject = (): CreateTransactionVMBuilder => {
    this.transaction.items = {}
    return this
  }

  public withoutItemsAmount = (): CreateTransactionVMBuilder => {
    delete this.transaction.items.item.amount
    return this
  }

  public withItemsAmountAsNotANumber = (): CreateTransactionVMBuilder => {
    this.transaction.items.item.amount = 'false'
    return this
  }

  public withoutItemsRelatedUsers = (): CreateTransactionVMBuilder => {
    delete this.transaction.items.item.related_users
    return this
  }

  public withItemsRelatedUsersAsNotAnArray = (): CreateTransactionVMBuilder => {
    this.transaction.items.item.related_users = 38
    return this
  }

  public withItemsRelatedUsersAsAnEmptyArray = (): CreateTransactionVMBuilder => {
    this.transaction.items.item.related_users = []
    return this
  }

  public withItemsRelatedUsersItemAsNotAString = (): CreateTransactionVMBuilder => {
    this.transaction.items.item.related_users = [[28]]
    return this
  }

  public withoutPayers = (): CreateTransactionVMBuilder => {
    delete this.transaction.payers
    return this
  }

  public withPayersAsAnArray = (): CreateTransactionVMBuilder => {
    this.transaction.payers = [10]
    return this
  }

  public withPayersAsAString = (): CreateTransactionVMBuilder => {
    this.transaction.payers = '10'
    return this
  }

  public withPayersAsNotAnObject = (): CreateTransactionVMBuilder => {
    this.transaction.payers = 10
    return this
  }

  public withPayersAsAnEmptyObject = (): CreateTransactionVMBuilder => {
    this.transaction.payers = {}
    return this
  }

  public withPayersItemAsNotANumber = (): CreateTransactionVMBuilder => {
    this.transaction.payers.D = true
    return this
  }

  public build = () => {
    return this.transaction
  }
}
