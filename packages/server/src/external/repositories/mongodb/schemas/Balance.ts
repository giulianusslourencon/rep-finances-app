import mongoose, { Document, Schema } from 'mongoose'

import { BalanceAttributes } from '@repositories/attributes'

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

export const BalanceModel = mongoose.model<BalanceDocument>(
  'Balance',
  BalanceSchema
)
