import mongoose, { Document, Schema, Model } from 'mongoose'

export type BalanceAttributes = {
  _id: string
  individual_balance: {
    [user_id: string]: number
  }
  updated: boolean
}

export type BalanceDocument = Document & BalanceAttributes

type BalanceModel = Model<BalanceDocument>

const BalanceSchema = new Schema(
  {
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
  }
)

export default mongoose.model<BalanceDocument, BalanceModel>('Balance', BalanceSchema)
