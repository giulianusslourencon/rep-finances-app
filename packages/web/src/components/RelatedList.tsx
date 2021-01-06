import { Wrap, WrapItem, WrapProps } from '@chakra-ui/react'
import React from 'react'

import IdBox from './IdBox'

type Props = {
  related: string[]
}

const RelatedList: React.FC<Props & WrapProps> = ({ related, ...props }) => {
  return (
    <Wrap spacing={1} justify="flex-end" align="center" {...props}>
      {related.sort().map(user => (
        <WrapItem key={user}>
          <IdBox userId={user} />
        </WrapItem>
      ))}
    </Wrap>
  )
}

export default RelatedList
