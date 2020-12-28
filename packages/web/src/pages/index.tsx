import { Flex, StackDivider, VStack } from '@chakra-ui/react'
import axios from 'axios'
import { GetStaticProps } from 'next'
import React from 'react'

import Cash from '@components/cash'
import IdBox from '@components/idBox'
import Layout from '@components/layout'

type Balance = {
  balance: {
    [userId: string]: number
  }
}

type Props = {
  balance: [string, number][]
}

const Home: React.FC<Props> = ({ balance }) => {
  return (
    <Layout
      buttons={[
        { title: 'Histórico', href: '/transactions' },
        { title: 'Adicionar', href: '/transactions/new' }
      ]}
    >
      <VStack
        divider={<StackDivider borderColor="purple.800" />}
        spacing="8px"
        align="stretch"
      >
        {balance.map(user => (
          <Flex key={user[0]} justify="space-between" align="center">
            <IdBox id={user[0]} size="lg" />
            <Cash amount={user[1]} size="lg" variant="dark" />
          </Flex>
        ))}
      </VStack>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const response = await axios.get<Balance>('http://localhost:3333/api/balance')
  const balance = response.data.balance

  return {
    props: {
      balance: Object.entries(balance)
    },
    revalidate: 10
  }
}

export default Home
