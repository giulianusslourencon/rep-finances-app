import React from 'react'

import Layout from '@components/layout'

const CreateTransaction: React.FC = () => {
  return (
    <Layout buttons={[{ title: 'Voltar', href: '/' }]}>
      <h1>New</h1>
    </Layout>
  )
}

export default CreateTransaction
