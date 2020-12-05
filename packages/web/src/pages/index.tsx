import { GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'

type BalanceProps = {
  balance: [string, number][]
}

const Home: React.FC<BalanceProps> = ({ balance }) => {
  return (
    <div>
      <Head>
        <title>Homepage</title>
      </Head>

      <main>
        <h1>Hello World</h1>
        <p>{balance}</p>
      </main>
    </div>
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
