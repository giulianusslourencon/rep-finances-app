import {
  Box,
  Flex,
  Wrap,
  StackDivider,
  Text,
  VStack,
  WrapItem
} from '@chakra-ui/react'
import moment from 'moment'
import Router from 'next/router'
import React, { useState } from 'react'
import DatePicker from 'react-datetime'
import Popup from 'reactjs-popup'
import 'react-datetime/css/react-datetime.css'
import 'reactjs-popup/dist/index.css'

import AmountInput from '@components/amountInput'
import Button from '@components/button'
import ErrorPopup from '@components/errorPopup'
import IdBox from '@components/idBox'
import Input from '@components/input'
import Layout from '@components/layout'

import API from '@utils/api'
import { validateTransaction, validateUserId } from '@utils/validateTransaction'

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
  const [invalidItemsNamesIndexes, setInvalidItemsNamesIndexes] = useState(
    [] as number[]
  )

  const [payers, setPayers] = useState([] as TransactionPayer[])

  const [related, setRelated] = useState([] as string[])
  const [newRelated, setNewRelated] = useState('')

  const [popupOpened, setPopupOpened] = useState(false)

  const [errors, setErrors] = useState(
    [] as { name: string; message: string }[]
  )

  const verifyInvalidItemsNames = () => {
    const registeredNames: string[] = []
    const duplicatedNames: string[] = []
    for (const item of items) {
      if (registeredNames.includes(item.itemName.trim()))
        duplicatedNames.push(item.itemName.trim())
      else registeredNames.push(item.itemName.trim())
    }

    const invalidIndexes = items
      .map((item, index) => {
        return { index, name: item.itemName }
      })
      .filter(item => duplicatedNames.includes(item.name.trim()))
      .map(item => item.index)

    setInvalidItemsNamesIndexes(invalidIndexes)
  }

  const updateItem = (index: number, values: Partial<TransactionItem>) => {
    const updatedItems = [...items]
    Object.assign(updatedItems[index], values)

    if (values.itemName !== undefined) verifyInvalidItemsNames()

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

  const validateNewRelated = () => {
    if (!validateUserId(newRelated)) return false
    return !related.includes(newRelated)
  }

  const addRelated = () => {
    if (!validateNewRelated()) return

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

    if (
      invalidItemsNamesIndexes.length === 0 &&
      validateTransaction(transaction)
    ) {
      try {
        const response = await API.post('/transactions', transaction)
        Router.push(`/transactions/item/${response.data._id}`)
      } catch (error) {
        const errorMessage = error.response?.data || {
          name: error.code,
          message: error.message
        }
        setErrors([errorMessage])
      }
    }
  }

  return (
    <Layout buttons={[{ title: 'Voltar', href: '/' }]}>
      <VStack
        divider={<StackDivider borderColor="purple.800" />}
        spacing="8px"
        align="stretch"
      >
        {errors.length > 0 && <ErrorPopup error={errors[0]} />}
        <Box>
          <Flex justify="space-between" align="flex-end">
            <Text fontSize="18px" fontWeight="600" color="purple.800">
              Título:
            </Text>
            <Input
              width="200px"
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
                  placeholder="Título"
                  isRequired={true}
                  isInvalid={invalidItemsNamesIndexes.includes(index)}
                  value={items[index].itemName}
                  onChange={val =>
                    updateItem(index, { itemName: val.target.value })
                  }
                />
                <Flex justify="space-between" align="center">
                  <AmountInput
                    value={items[index].amount.toFixed(2)}
                    onChange={val =>
                      updateItem(index, { amount: parseFloat(val) })
                    }
                  />
                  <Wrap spacing="4px" justify="flex-end" align="center">
                    {related.map(user => (
                      <WrapItem key={user}>
                        <IdBox
                          id={user}
                          onClick={() => changeUserOnItem(index, user)}
                          variant={
                            items[index].related_users.includes(user)
                              ? 'solid'
                              : 'outline'
                          }
                        />
                      </WrapItem>
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
                        flexDirection: 'column',
                        padding: '16px'
                      }}
                    >
                      <Input
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
                        isDisabled={!validateNewRelated()}
                        marginX={'50px'}
                        marginTop={'8px'}
                      >
                        Adicionar
                      </Button>
                    </Popup>
                  </Wrap>
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
                <AmountInput
                  value={payers[index].amount.toFixed(2)}
                  onChange={val => updatePayer(index, parseFloat(val))}
                />
              </Flex>
            ))}
          </VStack>
        </Box>
        <Flex justify="center">
          <Button
            onClick={handleCreateTransaction}
            isDisabled={
              invalidItemsNamesIndexes.length > 0 ||
              !validateTransaction(getTransactionObject())
            }
          >
            Criar Transação
          </Button>
        </Flex>
      </VStack>
    </Layout>
  )
}

export default CreateTransaction
