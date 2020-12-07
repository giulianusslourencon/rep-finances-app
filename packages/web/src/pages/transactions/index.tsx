import React from 'react'

import Buttons from '../../components/buttons'
import Container from '../../components/container'
import Layout from '../../components/layout'

const TransactionList: React.FC = () => {
  return (
    <Layout>
      <Buttons buttons={[{ title: 'Voltar', href: '/' }]} />
      <Container>
        <h1>List</h1>
      </Container>
    </Layout>
  )
}

export default TransactionList
