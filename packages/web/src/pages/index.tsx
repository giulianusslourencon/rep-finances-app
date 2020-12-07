import { GetStaticProps } from 'next'
import React from 'react'

import Buttons from '../components/buttons'
import Container from '../components/container'
import Layout from '../components/layout'

type BalanceProps = {
  balance: [string, number][]
}

const Home: React.FC<BalanceProps> = ({ balance }) => {
  return (
    <Layout>
      <Buttons
        buttons={[
          { title: 'Histórico', href: '/transactions' },
          { title: 'Adicionar', href: '/transactions/new' }
        ]}
      />
      <Container>
        <h1>Hello World</h1>
        <p>{balance}</p>
      </Container>
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
