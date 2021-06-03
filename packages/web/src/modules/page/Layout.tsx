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
  footer?: React.ReactNode
}

export const Layout: React.FC<Props & GridProps> = ({
  buttons = [],
  children,
  footer,
  ...props
}) => {
  return (
    <Grid
      as="main"
      height="100vh"
      templateColumns={{ base: '0 100vw 0', md: '1fr 22rem 1fr' }}
      templateRows={{ base: '0 1fr 0', md: '.5fr 45rem 1fr' }}
      templateAreas="
        '. . .'
        '. content .'
        '. . .'
      "
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      <Flex
        gridArea="content"
        flexDir="column"
        justify="stretch"
        alignSelf="start"
      >
        {buttons.length > 0 && (
          <VStack
            divider={<StackDivider borderColor="white" />}
            spacing={1}
            align="stretch"
            bgColor="purple.800"
            borderTopRadius={{ base: '0', md: '2rem' }}
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
          borderBottomRadius={{ base: '0', md: footer ? '0' : '2rem' }}
          borderTopRadius={{ base: '0', md: buttons.length > 0 ? '0' : '2rem' }}
          padding={4}
        >
          <Flex
            flexGrow={1}
            width="fit-content"
            height={{ base: 'auto', md: `${45 - 3 * buttons.length}rem` }}
            flexDir="column"
            justify="stretch"
            overflowY={{ base: 'unset', md: 'scroll' }}
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
        {footer && (
          <Flex
            bgColor="purple.800"
            borderBottomRadius={{ base: '0', md: '2rem' }}
            padding={4}
            justify="stretch"
          >
            {footer}
          </Flex>
        )}
      </Flex>
    </Grid>
  )
}
