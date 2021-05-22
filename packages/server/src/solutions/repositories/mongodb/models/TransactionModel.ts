import mongoose from 'mongoose'

import { TransactionSchema } from '@repositories/schemas'

export type TransactionDocument = mongoose.Document & TransactionSchema

const TransactionMongooseSchema = new mongoose.Schema({
  _id: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  items: {
    type: Map,
    of: {
      amount: Number,
      related_users: [String]
    }
  },
  payers: {
    type: Map,
    of: Number
  },
  related: {
    type: [String],
    required: true
  }
})

export const TransactionModel = mongoose.model<TransactionDocument>(
  'Transaction',
  TransactionMongooseSchema
)
