import { Flex, StackDivider, VStack } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import React from 'react'

import Cash from '@components/cash'
import Layout from '@components/layout'
import UserIdBox from '@components/userIdBox'

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
            <UserIdBox id={user[0]} />
            <Cash amount={user[1]} />
          </Flex>
        ))}
      </VStack>
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
