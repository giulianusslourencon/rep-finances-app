import { HStack } from '@chakra-ui/react'
import React from 'react'

import IdBox from './idBox'

type Props = {
  related: string[]
}

const RelatedList: React.FC<Props> = ({ related }) => {
  return (
    <HStack spacing="4px" justify="flex-end">
      {related.map(user => (
        <IdBox id={user} key={user} />
      ))}
    </HStack>
  )
}

export default RelatedList
