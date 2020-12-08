import React from 'react'

type Props = {
  children: React.ReactNode
  data: { id: string; value: number }[]
}

const TransactionData: React.FC<Props> = ({ children, data }) => {
  return (
    <div className="transaction_data">
      <span className="transaction_data_title">{children}</span>
      {data.map(user => {
        let classes = 'transaction_data_value'
        if (user.value < 0) classes = classes.concat(' negative')
        return (
          <span className="transaction_data_obj" key={user.id}>
            <span className="transaction_data_id">{user.id}</span>{' '}
            <span className={classes}>R$ {user.value.toFixed(2)}</span>
          </span>
        )
      })}
    </div>
  )
}

export default TransactionData
