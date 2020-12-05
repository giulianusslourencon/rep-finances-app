import { useRouter } from 'next/router'
import React from 'react'

const Transaction: React.FC = () => {
  const { query } = useRouter()

  return <h1>{query.transaction}</h1>
}

export default Transaction
