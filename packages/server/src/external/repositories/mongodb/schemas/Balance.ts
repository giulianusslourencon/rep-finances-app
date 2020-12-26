import mongoose from 'mongoose'

import { BalanceAttributes } from '@repositories/attributes'

export type BalanceDocument = mongoose.Document & BalanceAttributes

const BalanceSchema = new mongoose.Schema({
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
