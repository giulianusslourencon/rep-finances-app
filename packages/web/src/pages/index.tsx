import { GetStaticProps } from 'next'
import React from 'react'

import BalanceList from '@components/balanceList'
import Buttons from '@components/buttons'
import Container from '@components/container'
import Layout from '@components/layout'

type Props = {
  balance: [string, number][]
}

const Home: React.FC<Props> = ({ balance }) => {
  return (
    <Layout>
      <Buttons
        buttons={[
          { title: 'Histórico', href: '/transactions' },
          { title: 'Adicionar', href: '/transactions/new' }
        ]}
      />
      <Container>
        <BalanceList balance={balance} />
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const balance = {
    P: 50,
    G: -20,
    M: -30,
    F: 0
  }

  return {
    props: {
      balance: Object.entries(balance)
    },
    revalidate: 30
  }
}

export default Home
