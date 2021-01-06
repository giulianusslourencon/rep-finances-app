import {
  Flex,
  Grid,
  GridProps,
  Link,
  StackDivider,
  VStack
} from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'

type Props = {
  buttons: { title: string; href: string }[]
}

const Layout: React.FC<Props & GridProps> = ({
  buttons = [],
  children,
  ...props
}) => {
  return (
    <Grid
      as="main"
      height="100vh"
      templateColumns="1fr 22rem 1fr"
      templateRows="1fr 1fr 1fr"
      templateAreas="
        '. . .'
        '. content .'
        '. . .'
      "
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      <Flex gridArea="content" flexDir="column" justify="stretch">
        {buttons.length > 0 && (
          <VStack
            divider={<StackDivider borderColor="white" />}
            spacing={1}
            align="stretch"
            bgColor="purple.800"
            borderTopRadius="2rem"
            paddingX={4}
            paddingY={2}
          >
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
                  <Link
                    textAlign="center"
                    textTransform="uppercase"
                    fontWeight="300"
                    fontSize="2rem"
                  >
                    {button.title}
                  </Link>
                </NextLink>
              </Flex>
            ))}
          </VStack>
        )}
        <Flex
          justify="stretch"
          bgColor="yellow.200"
          borderBottomRadius="2rem"
          borderTopRadius={buttons.length > 0 ? '0' : '2rem'}
          padding={4}
          minH="25rem"
          maxH="43.75rem"
        >
          <Flex
            flexGrow={1}
            width="fit-content"
            flexDir="column"
            justify="stretch"
            overflowY="scroll"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            css={{
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            {children}
          </Flex>
        </Flex>
      </Flex>
    </Grid>
  )
}

export default Layout
