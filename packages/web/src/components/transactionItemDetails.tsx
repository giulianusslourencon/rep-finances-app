import React from 'react'

type Props = {
  item: [
    string,
    {
      value: number
      related_users: string[]
    }
  ]
}

const TransactionItemDetails: React.FC<Props> = ({ item }) => {
  return (
    <div className="transaction_item_details">
      <span className="transaction_item_details_title">{item[0]}</span>
      <span className="transaction_item_details_related">
        {item[1].related_users.map(user_id => (
          <span key={user_id} className="transaction_related_id">
            {user_id}
          </span>
        ))}
      </span>
      <span className="transaction_item_details_value">
        <span className="total_value">R$ {item[1].value.toFixed(2)}</span>
        {item[1].related_users.length > 1 && (
          <span className="individual_value">
            <span>{item[1].related_users.length}x</span> R${' '}
            {(item[1].value / item[1].related_users.length).toFixed(2)}
          </span>
        )}
      </span>
    </div>
  )
}

export default TransactionItemDetails
