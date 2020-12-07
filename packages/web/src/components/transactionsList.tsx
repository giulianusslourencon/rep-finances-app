import React from 'react'

import TransactionItem from './transactionItem'

type Transaction = {
  _id: string
  title: string
  timestamp: number
  amount: number
  related: string[]
}

type Props = {
  transactions: Transaction[]
}

const TransactionsList: React.FC<Props> = ({ transactions }) => {
  return (
    <div id="transactions">
      {transactions.map((transaction, index) => (
        <>
          <TransactionItem transaction={transaction} key={transaction._id} />
          {index !== transactions.length - 1 && (
            <hr className="lineAmongBalance" key={transaction._id} />
          )}
        </>
      ))}
    </div>
  )
}

export default TransactionsList
