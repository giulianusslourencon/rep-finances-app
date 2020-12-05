import mongoose, { Document, Schema } from 'mongoose'

export type TransactionAttributes = {
  _id: string
  title: string
  amount: number
  timestamp: number
  month: string
  items: {
    [title: string]: {
      value: number
      related_users: string[]
    }
  }
  payers: {
    [user_id: string]: number
  }
  related: string[]
}

export type TransactionDocument = Document & TransactionAttributes

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
