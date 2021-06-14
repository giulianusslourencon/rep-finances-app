import { Button, Flex, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'

import { Layout } from '@modules/page'

type ButtonInfo = { title: string; href: string }

export const SelectTransactionTypePage: React.FC = () => {
  const buttons: ButtonInfo[] = [
    { title: 'Normal', href: '/transactions/new/default' },
    { title: 'Transferência', href: '/transactions/new/transfer' }
  ]

  return (
    <Layout buttons={[{ title: 'Voltar', href: '/' }]}>
      <VStack spacing={1} align="stretch" paddingX={4} paddingY={2}>
        {buttons.map(button => (
          <Flex
            h="3rem"
            color="white"
            key={button.href}
            justify="center"
            align="center"
            padding={2}
          >
            <NextLink href={button.href}>
              <Button
                textAlign="center"
                textTransform="uppercase"
                fontWeight="300"
                fontSize="1.5rem"
                width="16rem"
              >
                {button.title}
              </Button>
            </NextLink>
          </Flex>
        ))}
      </VStack>
    </Layout>
  )
}
