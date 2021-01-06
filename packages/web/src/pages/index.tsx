import { Flex, StackDivider, VStack } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import React from 'react'

import Cash from '@components/cash'
import ErrorPopup from '@components/errorPopup'
import IdBox from '@components/idBox'
import Layout from '@components/layout'

import API from '@utils/api'

type Balance = {
  balance: {
    [userId: string]: number
  }
}

type Props = {
  error?: { name: string; message: string }
  balance: [string, number][]
}

const Home: React.FC<Props> = ({ error, balance }) => {
  return (
    <Layout
      buttons={[
        { title: 'Histórico', href: '/transactions' },
        { title: 'Adicionar', href: '/transactions/new' }
      ]}
    >
      {error && <ErrorPopup error={error} />}
      <VStack
        divider={<StackDivider borderColor="purple.800" />}
        spacing="8px"
        align="stretch"
      >
        {balance
          .sort((a, b) => {
            if (a[0] < b[0]) return -1
            if (a[0] > b[0]) return 1
            return 0
          })
          .map(user => (
            <Flex key={user[0]} justify="space-between" align="center">
              <IdBox userId={user[0]} size="lg" />
              <Cash amount={user[1]} size="lg" variant="dark" />
            </Flex>
          ))}
      </VStack>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const props: Props = {
    balance: []
  }

  try {
    const response = await API.get<Balance>('/balance')
    const balance = response.data.balance

    props.balance = Object.entries(balance)
  } catch (error) {
    const errorMessage = error.response?.data || {
      name: error.code,
      message: error.message
    }
    props.error = errorMessage
  }

  return {
    props,
    revalidate: 10
  }
}

export default Home
