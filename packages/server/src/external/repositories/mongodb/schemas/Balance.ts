import mongoose, { Document, Schema } from 'mongoose'

import { BalanceProps } from '@shared/types/Balance'

export type BalanceAttributes = BalanceProps & {
  _id: string
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
