import {
  Button,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Wrap,
  WrapItem
} from '@chakra-ui/react'
import React from 'react'

import { IdBox } from '@modules/resource'

type UserSelectPopoverProps = {
  selectedId: string
  selectionList: string[]
  onSelectId: (value: string) => void
  relatedModalDisclosure: { onOpen: () => void }
}

export const UserSelectPopover: React.FC<UserSelectPopoverProps> = ({
  selectedId,
  selectionList,
  onSelectId,
  relatedModalDisclosure
}) => {
  return (
    <Popover>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            {/* <IdBox userId={selectedId} /> */}
            <Button>{selectedId}</Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverHeader>Selecione o Usuário</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <Wrap spacing={1} justify="flex-end" align="center">
                  {selectionList.map(user => (
                    <WrapItem key={user}>
                      <IdBox
                        userId={user}
                        onClick={() => {
                          if (user !== selectedId) {
                            onSelectId(user)
                            onClose()
                          }
                        }}
                        variant={user === selectedId ? 'solid' : 'outline'}
                      />
                    </WrapItem>
                  ))}
                  <WrapItem>
                    <IdBox
                      onClick={relatedModalDisclosure.onOpen}
                      userId={'+'}
                    />
                  </WrapItem>
                </Wrap>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
  )
}
