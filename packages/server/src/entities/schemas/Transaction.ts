import mongoose, { Document, Schema, Model } from 'mongoose'

export type TransactionAttributes = {
  _id: string
  title: string
  amount: number
  timestamp: number
  items: {
    [title: string]: {
      value: number
      related_users: string[]
    }
  }
  payers: {
    [user_id: string]: number
  }
}

export type TransactionDocument = Document & TransactionAttributes

type TransactionModel = Model<TransactionDocument>

const TransactionSchema = new Schema(
  {
    _id: {
      type: String,
      trim: true
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
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
    }
  }
)

export default mongoose.model<TransactionDocument, TransactionModel>('Transaction', TransactionSchema)
