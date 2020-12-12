import { Flex, StackDivider, VStack } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import React from 'react'

import Cash from '@components/cash'
import IdBox from '@components/idBox'
import Layout from '@components/layout'

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
