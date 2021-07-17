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

import { validateUserId } from '@utils/validateTransaction'

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
  const validId = validateUserId

  return (
    <Popover>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            {/* <IdBox userId={selectedId} /> */}
            <Button
              variant={validId(selectedId) ? 'solid' : 'ghost'}
              borderRadius="0.125rem"
              width="1.5rem"
              height="1.5rem"
            >
              {selectedId}
            </Button>
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
