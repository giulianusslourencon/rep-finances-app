import { Flex, Grid, Link, StackDivider, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'

type Props = {
  buttons: { title: string; href: string }[]
}

const Layout: React.FC<Props> = ({ buttons = [], children }) => {
  return (
    <Grid
      as="main"
      height="100vh"
      templateColumns="1fr 350px 1fr"
      templateRows="1fr 1fr 1fr"
      templateAreas="
        '. . .'
        '. content .'
        '. . .'
      "
      justifyContent="center"
      alignItems="center"
    >
      <Flex gridArea="content" flexDir="column" justify="stretch">
        {buttons.length > 0 && (
          <VStack
            divider={<StackDivider borderColor="white" />}
            spacing="4px"
            align="stretch"
            bgColor="purple.800"
            borderTopRadius="32px"
            paddingX="16px"
            paddingY="8px"
          >
            {buttons.map(button => (
              <Flex
                h="48px"
                color="white"
                key={button.href}
                justify="center"
                align="center"
                padding="8px"
              >
                <NextLink href={button.href}>
                  <Link
                    textAlign="center"
                    textTransform="uppercase"
                    fontWeight="300"
                    fontSize="32px"
                  >
                    {button.title}
                  </Link>
                </NextLink>
              </Flex>
            ))}
          </VStack>
        )}
        <Flex
          bgColor="yellow.200"
          borderBottomRadius="32px"
          borderTopRadius={buttons.length > 0 ? '0' : '32px'}
          padding="16px"
          minH="400px"
          flexDir="column"
          justify="stretch"
        >
          {children}
        </Flex>
      </Flex>
    </Grid>
  )
}

export default Layout
