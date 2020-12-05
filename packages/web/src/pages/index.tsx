import { GetStaticProps } from 'next'
import Link from 'next/link'
import React from 'react'

import Layout from '../components/layout'

type BalanceProps = {
  balance: [string, number][]
}

const Home: React.FC<BalanceProps> = ({ balance }) => {
  return (
    <Layout>
      <h1>Hello World</h1>
      <p>{balance}</p>
      <Link href="/transactions">
        <a>Ver Transações</a>
      </Link>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<BalanceProps> = async () => {
  const balance = {
    P: 50,
    G: -20,
    M: -30
  }

  return {
    props: {
      balance: Object.entries(balance)
    },
    revalidate: 30
  }
}

export default Home
