import React from 'react'

import Buttons from '@components/buttons'
import Container from '@components/container'
import Layout from '@components/layout'

const CreateTransaction: React.FC = () => {
  return (
    <Layout>
      <Buttons buttons={[{ title: 'Voltar', href: '/' }]} />
      <Container>
        <h1>New</h1>
      </Container>
    </Layout>
  )
}

export default CreateTransaction
