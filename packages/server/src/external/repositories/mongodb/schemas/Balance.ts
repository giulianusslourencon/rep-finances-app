import mongoose, { Document, Schema } from 'mongoose'

export type BalanceAttributes = {
  _id: string
  individual_balance: {
    [user_id: string]: number
  }
  updated: boolean
}

export type BalanceDocument = Document & BalanceAttributes

const BalanceSchema = new Schema({
  _id: {
    type: String,
    trim: true
  },
  individual_balance: {
    type: Map,
    of: Number
  },
  updated: {
    type: Boolean,
    default: true
  }
})

export default mongoose.model<BalanceDocument>('Balance', BalanceSchema)
