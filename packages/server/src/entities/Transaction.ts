import { uuid } from "uuidv4"

export class Transaction {
  public readonly _id!: string

  public title!: string
  public timestamp!: number
  
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
    const itemsValues = Object.values(props.items).reduce((acc, cur) => acc + cur.value, 0)
    const totalPaid = Object.values(props.payers).reduce((acc, cur) => acc + cur)

    if (itemsValues !== totalPaid) {
      throw new Error('Items values are distinct from total paid.')
    }
    
    Object.assign(this, props)
    this.amount = itemsValues

    if (!id) {
      this._id = uuid()
    }
  }
}