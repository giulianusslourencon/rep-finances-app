import {
  StackProps,
  Flex,
  Grid,
  StackDivider,
  VStack,
  Text
} from '@chakra-ui/react'
import React from 'react'

import Cash from '@components/Cash'
import RelatedList from '@components/RelatedList'

type Props = {
  items: {
    [itemName: string]: {
      amount: number
      related_users: string[]
    }
  }
}

export const TransactionItemsSection: React.FC<Props & StackProps> = ({
  items
}) => {
  return (
    <VStack
      divider={<StackDivider borderColor="purple.800" marginX={4} />}
      spacing={1}
      align="stretch"
    >
      {Object.entries(items).map(item => (
        <Grid
          key={item[0]}
          templateColumns="7.5rem 1fr 6.875rem"
          templateRows="1fr"
          templateAreas="
                'itemName relatedUsers amount'
              "
          justifyContent="center"
          alignItems="center"
        >
          <Text gridArea="itemName">{item[0]}</Text>
          <RelatedList
            gridArea="relatedUsers"
            related={item[1].related_users}
            justify="center"
          />
          <Flex gridArea="amount" flexDir="column" align="end">
            <Cash amount={item[1].amount} />
            {item[1].related_users.length > 1 && (
              <Flex align="center" justify="end">
                <Text variant="thin" fontSize="xs" marginRight={0.5}>
                  {item[1].related_users.length}x
                </Text>
                <Cash amount={item[1].amount / item[1].related_users.length} />
              </Flex>
            )}
          </Flex>
        </Grid>
      ))}
    </VStack>
  )
}
