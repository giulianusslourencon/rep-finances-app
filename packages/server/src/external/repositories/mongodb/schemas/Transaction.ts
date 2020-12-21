import mongoose, { Document, Schema } from 'mongoose'

import { TransactionProps } from '@shared/@types/Transaction'

export type TransactionDocument = Document & TransactionProps

const TransactionSchema = new Schema({
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
  timestamp: {
    type: Number,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  items: {
    type: Map,
    of: {
      value: Number,
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

export default mongoose.model<TransactionDocument>(
  'Transaction',
  TransactionSchema
)
