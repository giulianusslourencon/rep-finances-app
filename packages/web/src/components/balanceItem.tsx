import React from 'react'

type Props = {
  individual_balance: [string, number]
}

const BalanceItem: React.FC<Props> = ({ individual_balance }) => {
  const [id, amount] = individual_balance
  let classes = 'balance_amount'
  if (amount < 0) classes = classes.concat(' negative')

  return (
    <div className="individual_balance">
      <span className="balance_id">{id}</span>
      <span className={classes}>R$ {amount.toFixed(2)}</span>
    </div>
  )
}

export default BalanceItem
