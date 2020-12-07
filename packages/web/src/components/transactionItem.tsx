import Link from 'next/link'
import React from 'react'

type Transaction = {
  _id: string
  title: string
  timestamp: number
  amount: number
  related: string[]
}

type Props = {
  transaction: Transaction
}

const TransactionItem: React.FC<Props> = ({ transaction }) => {
  const date = new Date(transaction.timestamp)
  const formattedDate = date.toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  return (
    <Link href={`/transactions/item/${transaction._id}`}>
      <a>
        <div className="transaction_item">
          <div>
            <span className="transaction_title">{transaction.title}</span>
            <span className="transaction_amount">
              R$ {transaction.amount.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="transaction_date">{formattedDate}</span>
            <span className="transaction_related">
              {transaction.related.map(id => (
                <span key={id} className="transaction_related_id">
                  {id}
                </span>
              ))}
            </span>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default TransactionItem
