import React from 'react'

import BalanceItem from './balanceItem'

type Props = {
  balance: [string, number][]
}

const BalanceList: React.FC<Props> = ({ balance }) => {
  return (
    <div id="balance">
      {balance.map((individual_balance, index) => (
        <>
          <BalanceItem
            individual_balance={individual_balance}
            key={individual_balance[0]}
          />
          {index !== balance.length - 1 && (
            <hr className="lineAmongBalance" key={individual_balance[0]} />
          )}
        </>
      ))}
    </div>
  )
}

export default BalanceList
