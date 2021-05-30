import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon
} from '@chakra-ui/icons'
import { Flex, StackProps, HStack, IconButton, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'

type PaginationProps = {
  itemsCount: number
  curPage: number
  firstIndex: number
  lastIndex: number
}

type Props = {
  paginationProps: PaginationProps
}

export const PageFooter: React.FC<Props & StackProps> = ({
  paginationProps
}) => {
  return (
    <Flex flexGrow={1} justify="space-between" align="center">
      <HStack>
        <NextLink href="/transactions?page=1">
          <IconButton
            variant="ghost"
            color="white"
            colorScheme="whiteAlpha"
            aria-label="Primeira"
            icon={<ArrowLeftIcon />}
            disabled={paginationProps.curPage === 1}
          />
        </NextLink>
        <NextLink href={`/transactions?page=${paginationProps.curPage - 1}`}>
          <IconButton
            variant="ghost"
            color="white"
            colorScheme="whiteAlpha"
            aria-label="Anterior"
            icon={<ChevronLeftIcon />}
            disabled={paginationProps.curPage === 1}
          />
        </NextLink>
      </HStack>
      <Text color="white">
        {`${paginationProps.firstIndex}-${paginationProps.lastIndex}/${paginationProps.itemsCount}`}
      </Text>
      <HStack>
        <NextLink href={`/transactions?page=${paginationProps.curPage + 1}`}>
          <IconButton
            variant="ghost"
            color="white"
            colorScheme="whiteAlpha"
            aria-label="Próxima"
            icon={<ChevronRightIcon />}
            disabled={paginationProps.lastIndex >= paginationProps.itemsCount}
          />
        </NextLink>
        <NextLink
          href={`/transactions?page=${
            Math.floor((paginationProps.itemsCount - 1) / 15) + 1
          }`}
        >
          <IconButton
            variant="ghost"
            color="white"
            colorScheme="whiteAlpha"
            aria-label="Última"
            icon={<ArrowRightIcon />}
            disabled={paginationProps.lastIndex >= paginationProps.itemsCount}
          />
        </NextLink>
      </HStack>
    </Flex>
  )
}
