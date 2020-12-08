import React from 'react'

import TransactionItemDetails from './transactionItemDetails'

type Props = {
  items: [
    string,
    {
      value: number
      related_users: string[]
    }
  ][]
}

const TransactionItemsList: React.FC<Props> = ({ items }) => {
  return (
    <div id="transaction_items_list">
      {items.map((item, index) => (
        <>
          <TransactionItemDetails item={item} key={item[0]} />
          {index !== items.length - 1 && (
            <hr className="line_between_transaction_items" key={item[0]} />
          )}
        </>
      ))}
    </div>
  )
}

export default TransactionItemsList
