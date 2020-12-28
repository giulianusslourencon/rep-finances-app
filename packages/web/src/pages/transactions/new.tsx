import {
  Box,
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
import axios from 'axios'
import moment from 'moment'
import Router from 'next/router'
import React, { useState } from 'react'
import DatePicker from 'react-datetime'
import Popup from 'reactjs-popup'
import 'react-datetime/css/react-datetime.css'
import 'reactjs-popup/dist/index.css'

import Button from '@components/button'
import IdBox from '@components/idBox'
import Layout from '@components/layout'

import { validateTransaction } from '@utils/validateTransaction'

type TransactionItem = {
  itemName: string
  related_users: string[]
  amount: number
}

type TransactionPayer = {
  userId: string
  amount: number
}

const CreateTransaction: React.FC = () => {
  const baseItem: TransactionItem = {
    itemName: '',
    related_users: [],
    amount: 0
  }

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

  const changeUserOnItem = (index: number, userId: string) => {
    const itemRelated = [...items[index].related_users]
    const userIndex = itemRelated.indexOf(userId)

    if (userIndex === -1) itemRelated.push(userId)
    else itemRelated.splice(userIndex, 1)

    updateItem(index, { related_users: itemRelated })
  }

  const addRelated = () => {
    if (
      related.includes(newRelated) ||
      newRelated.length <= 0 ||
      newRelated.length > 2
    )
      return

    const currentRelated = [...related]
    currentRelated.push(newRelated)

    const currentPayers = [...payers]
    currentPayers.push({ userId: newRelated, amount: 0 })

    setNewRelated('')
    setRelated(currentRelated)
    setPayers(currentPayers)
  }

  const addNewItem = () => {
    setItems([...items, { ...baseItem }])
  }

  const closePopup = () => setPopupOpened(false)

  const getTransactionObject = () => {
    const objItems = {} as {
      [itemName: string]: Omit<TransactionItem, 'itemName'>
    }
    items.map(
      item =>
        (objItems[item.itemName] = {
          amount: item.amount,
          related_users: item.related_users
        })
    )

    const objPayers = {} as { [userId: string]: number }
    payers.forEach(payer => {
      if (payer.amount) objPayers[payer.userId] = payer.amount
    })

    return {
      title,
      timestamp: timestamp.valueOf(),
      items: objItems,
      payers: objPayers
    }
  }

  const handleCreateTransaction = async () => {
    const transaction = getTransactionObject()

    if (validateTransaction(transaction)) {
      const response = await axios.post(
        'http://localhost:3333/api/transactions',
        transaction
      )
      if (response.status === 201)
        Router.push(`/transactions/item/${response.data._id}`)
    }
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
                  placeholder="Título"
                  isRequired={true}
                  value={items[index].itemName}
                  onChange={val =>
                    updateItem(index, { itemName: val.target.value })
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
                    value={items[index].amount.toFixed(2)}
                    onChange={val =>
                      updateItem(index, { amount: parseFloat(val) })
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
                      position="center center"
                      arrow={false}
                      closeOnDocumentClick
                      closeOnEscape
                      modal={true}
                      contentStyle={{
                        width: '300px',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Input
                        variant="flushed"
                        size="sm"
                        fontSize="16px"
                        borderColor="purple.400"
                        focusBorderColor="purple.600"
                        value={newRelated}
                        maxLength={2}
                        onChange={val =>
                          setNewRelated(val.target.value.trim().toUpperCase())
                        }
                        onKeyDown={event => {
                          if (event.key.valueOf() === 'Enter') addRelated()
                        }}
                      />
                      <Button
                        onClick={() => {
                          addRelated()
                          closePopup()
                        }}
                        isDisabled={newRelated.length === 0}
                        marginX={'50px'}
                        marginTop={'8px'}
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
          <Button
            onClick={handleCreateTransaction}
            isDisabled={!validateTransaction(getTransactionObject())}
          >
            Criar Transação
          </Button>
        </Flex>
      </VStack>
    </Layout>
  )
}

export default CreateTransaction
