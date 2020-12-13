import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  StackDivider,
  Text,
  VStack
} from '@chakra-ui/react'
import moment from 'moment'
import React, { useState } from 'react'
import DatePicker from 'react-datetime'
import Popup from 'reactjs-popup'
import 'react-datetime/css/react-datetime.css'
import 'reactjs-popup/dist/index.css'

import IdBox from '@components/idBox'
import Layout from '@components/layout'

type TransactionItem = {
  title: string
  related_users: string[]
  value: number
}

type TransactionPayer = {
  user: string
  amount: number
}

const CreateTransaction: React.FC = () => {
  const baseItem: TransactionItem = { title: '', related_users: [], value: 0 }

  const [title, setTitle] = useState('')
  const [timestamp, setTimestamp] = useState(moment())

  const [items, setItems] = useState([{ ...baseItem }])
  const [payers, setPayers] = useState([] as TransactionPayer[])

  const [related, setRelated] = useState([] as string[])
  const [newRelated, setNewRelated] = useState('')

  const [popupOpened, setPopupOpened] = useState(false)

  const updateItem = (index: number, values: Partial<TransactionItem>) => {
    const updatedItems = [...items]
    Object.assign(updatedItems[index], values)
    setItems(updatedItems)
  }

  const updatePayer = (index: number, amount: number) => {
    const updatedPayers = [...payers]
    updatedPayers[index].amount = amount
    setPayers(updatedPayers)
  }

  const changeUserOnItem = (index: number, user: string) => {
    const itemRelated = [...items[index].related_users]
    const userIndex = itemRelated.indexOf(user)

    if (userIndex === -1) itemRelated.push(user)
    else itemRelated.splice(userIndex, 1)

    updateItem(index, { related_users: itemRelated })
  }

  const addRelated = () => {
    if (related.includes(newRelated)) return

    const currentRelated = [...related]
    currentRelated.push(newRelated)

    const currentPayers = [...payers]
    currentPayers.push({ user: newRelated, amount: 0 })

    setNewRelated('')
    setRelated(currentRelated)
    setPayers(currentPayers)
  }

  const addNewItem = () => {
    setItems([...items, { ...baseItem }])
  }

  const closePopup = () => setPopupOpened(false)

  const handleCreateTransaction = () => {
    const objItems = {} as { [x: string]: Omit<TransactionItem, 'title'> }
    items.map(
      item =>
        (objItems[item.title] = {
          value: item.value,
          related_users: item.related_users
        })
    )

    const objPayers = {} as { [x: string]: number }
    payers.map(payer => (objPayers[payer.user] = payer.amount))

    const transaction = {
      title,
      timestamp: timestamp.valueOf(),
      items: objItems,
      payers: objPayers
    }

    console.log(JSON.stringify(transaction))
  }

  return (
    <Layout buttons={[{ title: 'Voltar', href: '/' }]}>
      <VStack
        divider={<StackDivider borderColor="purple.800" />}
        spacing="8px"
        align="stretch"
      >
        <Box>
          <Flex justify="space-between" align="flex-end">
            <Text fontSize="18px" fontWeight="600" color="purple.800">
              Título:
            </Text>
            <Input
              variant="flushed"
              size="sm"
              width="200px"
              fontSize="16px"
              borderColor="purple.400"
              focusBorderColor="purple.600"
              isRequired={true}
              value={title}
              onChange={val => setTitle(val.target.value)}
            />
          </Flex>
          <Flex justify="space-between" align="flex-end">
            <Text fontSize="18px" fontWeight="600" color="purple.800">
              Data/Hora:
            </Text>
            <DatePicker
              dateFormat="DD-MM-YYYY"
              timeFormat="hh:mm A"
              inputProps={{
                style: {
                  backgroundColor: '#E6FB71',
                  borderBottom: '1px solid #CB60D3',
                  width: '200px',
                  fontSize: '16px'
                }
              }}
              value={timestamp}
              onChange={val => setTimestamp(val as typeof timestamp)}
            />
          </Flex>
        </Box>
        <Box>
          <Text fontSize="18px" fontWeight="600" color="purple.800">
            Itens:
          </Text>
          <VStack spacing="4px">
            {items.map((item, index) => (
              <Box
                key={index}
                borderRadius="16px"
                borderColor="purple.400"
                borderWidth="1px"
                padding="16px"
              >
                <Input
                  variant="flushed"
                  size="sm"
                  fontSize="16px"
                  borderColor="purple.400"
                  focusBorderColor="purple.600"
                  value={items[index].title}
                  onChange={val =>
                    updateItem(index, { title: val.target.value })
                  }
                />
                <Flex justify="space-between">
                  <NumberInput
                    variant="flushed"
                    borderColor="purple.400"
                    focusBorderColor="purple.600"
                    size="sm"
                    precision={2}
                    step={0.5}
                    min={0}
                    value={items[index].value.toFixed(2)}
                    onChange={val =>
                      updateItem(index, { value: parseFloat(val) })
                    }
                  >
                    <NumberInputField fontSize="16px" width="100px" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <HStack spacing="4px" justify="flex-end">
                    {related.map(user => (
                      <IdBox
                        id={user}
                        key={user}
                        onClick={() => changeUserOnItem(index, user)}
                        variant={
                          items[index].related_users.includes(user)
                            ? 'solid'
                            : 'outline'
                        }
                      />
                    ))}
                    <Popup
                      trigger={
                        <IdBox id={'+'} onClick={() => setPopupOpened(true)} />
                      }
                      open={popupOpened}
                      onClose={closePopup}
                      position="top center"
                      arrow={false}
                      closeOnDocumentClick
                      closeOnEscape
                    >
                      <Input
                        variant="flushed"
                        size="sm"
                        fontSize="16px"
                        borderColor="purple.400"
                        focusBorderColor="purple.600"
                        value={newRelated}
                        onChange={val => setNewRelated(val.target.value)}
                      />
                      <Button
                        onClick={() => {
                          addRelated()
                          closePopup()
                        }}
                      >
                        Adicionar
                      </Button>
                    </Popup>
                  </HStack>
                </Flex>
              </Box>
            ))}
            <Button onClick={addNewItem}>Adicionar item</Button>
          </VStack>
        </Box>
        <Box>
          <Text fontSize="18px" fontWeight="600" color="purple.800">
            Pagadores:
          </Text>
          <VStack spacing="4px" align="flex-start">
            {related.map((user, index) => (
              <Flex key={user}>
                <IdBox id={user} marginRight="8px" marginLeft="16px" />
                <NumberInput
                  variant="flushed"
                  borderColor="purple.400"
                  focusBorderColor="purple.600"
                  size="sm"
                  precision={2}
                  step={0.5}
                  min={0}
                  value={payers[index].amount.toFixed(2)}
                  onChange={val => updatePayer(index, parseFloat(val))}
                >
                  <NumberInputField fontSize="16px" width="100px" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
            ))}
          </VStack>
        </Box>
        <Flex justify="center">
          <Button onClick={handleCreateTransaction}>Criar Transação</Button>
        </Flex>
      </VStack>
    </Layout>
  )
}

export default CreateTransaction
