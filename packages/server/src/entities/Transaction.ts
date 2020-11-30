import { v4 as uuid } from "uuid"

export class Transaction {
  public readonly _id!: string

  public title!: string
  public month!: string
  
  public items!: { 
    [title: string]: {
      value: number
      related_users: string[]
    }
  }

  public payers!: { 
    [user_id: string]: number
  }

  public readonly amount!: number

  constructor(props: Omit<Transaction, '_id' | 'amount'>, id?: string) {
    const itemsValues = Object.values(props.items).reduce(
      (acc, cur) => {
        if (cur.value <= 0) throw new Error('All items values and payers amount must be a positive number')
        return acc + cur.value
      }, 0
    )
    const totalPaid = Object.values(props.payers).reduce(
      (acc, cur) => {
        if (cur <= 0) throw new Error('All items values and payers amount must be a positive number')
        return acc + cur
      }, 0
    )

    if (itemsValues !== totalPaid) {
      throw new Error('Items values are distinct from total paid')
    }
    if (itemsValues === 0) {
      throw new Error('There must be some money involved in the transaction')
    }
    this.amount = itemsValues
    
    Object.assign(this, props)

    if (!id) {
      this._id = uuid()
    }
  }
}