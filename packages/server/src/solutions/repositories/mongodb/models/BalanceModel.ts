import mongoose from 'mongoose'

import { BalanceSchema } from '@repositories/schemas'

export type BalanceDocument = mongoose.Document & BalanceSchema

const BalanceMongooseSchema = new mongoose.Schema({
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
  BalanceMongooseSchema
)
