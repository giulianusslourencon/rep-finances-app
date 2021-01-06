import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Wrap,
  StackDivider,
  Text,
  VStack,
  WrapItem,
  CloseButton,
  Tooltip,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Heading,
  PopoverCloseButton,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle
} from '@chakra-ui/react'
import moment from 'moment'
import Router from 'next/router'
import React, { useState } from 'react'
import DatePicker from 'react-datetime'
import 'react-datetime/css/react-datetime.css'

import AmountInput from '@components/amountInput'
import Button from '@components/button'
import ErrorPopup from '@components/errorPopup'
import IdBox from '@components/idBox'
import LabelInput from '@components/labelInput'
import Layout from '@components/layout'

import API from '@utils/api'
import {
  validateAmount,
  validateLabel,
  validateTransaction,
  validateUserId
} from '@utils/validateTransaction'

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

  const addRelated = (selectedItemIndex: number) => {
    if (!validateNewRelated()) return

    const currentRelated = [...related]
    currentRelated.push(newRelated)

    const currentPayers = [...payers]
    currentPayers.push({ userId: newRelated, amount: 0 })

    changeUserOnItem(selectedItemIndex, newRelated)
    setNewRelated('')
    setRelated(currentRelated.sort())
    setPayers(currentPayers)
  }

  const addNewItem = () => {
    setItems([...items, { ...baseItem }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1 && index < items.length) {
      const allItems = [...items]
      allItems.splice(index, 1)
      setItems(allItems)
    }
  }

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

  const transaction = getTransactionObject()
  let { validated, errorMessage } = validateTransaction(transaction)

  validated &&= invalidItemsNamesIndexes.length === 0

  const handleCreateTransaction = async () => {
    if (validated) {
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
          <Tooltip
            shouldWrapChildren
            label="Título da transação"
            openDelay={500}
            hasArrow
            placement="top"
          >
            <Flex justify="space-between" align="flex-end">
              <Text fontSize="18px" fontWeight="600" color="purple.800">
                Título:
              </Text>
              <LabelInput
                width="200px"
                placeholder="Título"
                isRequired={true}
                isInvalid={!validateLabel(title)}
                value={title}
                onChange={val => setTitle(val.target.value)}
              />
            </Flex>
          </Tooltip>
          <Tooltip
            shouldWrapChildren
            label="Momento em que a transação aconteceu"
            openDelay={500}
            hasArrow
            placement="top"
          >
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
                locale={'pt-BR'}
                value={timestamp}
                onChange={val => setTimestamp(val as typeof timestamp)}
              />
            </Flex>
          </Tooltip>
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
                <Flex justify="space-between" align="center">
                  <Tooltip
                    shouldWrapChildren
                    label="Nome do item"
                    openDelay={500}
                    hasArrow
                    placement="top"
                  >
                    <LabelInput
                      placeholder="Item"
                      isRequired={true}
                      isInvalid={
                        !validateLabel(items[index].itemName) ||
                        invalidItemsNamesIndexes.includes(index)
                      }
                      value={items[index].itemName}
                      onChange={val =>
                        updateItem(index, { itemName: val.target.value })
                      }
                    />
                  </Tooltip>
                  <Tooltip
                    shouldWrapChildren
                    label={
                      items.length <= 1
                        ? 'Não é possível uma transação com menos de um item'
                        : 'Excluir item'
                    }
                    openDelay={500}
                    hasArrow
                    placement="top"
                  >
                    <CloseButton
                      size="sm"
                      color="red.500"
                      onClick={() => removeItem(index)}
                      isDisabled={items.length <= 1}
                    />
                  </Tooltip>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Tooltip
                    shouldWrapChildren
                    label="Valor do item"
                    openDelay={500}
                    hasArrow
                    placement="top"
                  >
                    <AmountInput
                      value={items[index].amount.toFixed(2)}
                      onChange={val =>
                        updateItem(index, { amount: parseFloat(val) })
                      }
                      isInvalid={!validateAmount(items[index].amount)}
                    />
                  </Tooltip>
                  <Wrap spacing="4px" justify="flex-end" align="center">
                    {related.map(user => (
                      <WrapItem key={user}>
                        <IdBox
                          userId={user}
                          onClick={() => changeUserOnItem(index, user)}
                          variant={
                            items[index].related_users.includes(user)
                              ? 'solid'
                              : 'outline'
                          }
                        />
                      </WrapItem>
                    ))}
                    <WrapItem>
                      <Popover placement="right">
                        <PopoverTrigger>
                          <IdBox as="button" userId={'+'} />
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverHeader>
                            <Heading
                              size="sm"
                              textAlign="center"
                              color="purple.800"
                            >
                              Adicionar usuários relacionados
                            </Heading>
                          </PopoverHeader>
                          <PopoverCloseButton />
                          <PopoverBody>
                            <Tooltip
                              shouldWrapChildren
                              label="Id do usuário"
                              openDelay={500}
                              hasArrow
                              placement="top"
                            >
                              <LabelInput
                                value={newRelated}
                                minLength={1}
                                maxLength={2}
                                onChange={val =>
                                  setNewRelated(
                                    val.target.value.trim().toUpperCase()
                                  )
                                }
                                onKeyDown={event => {
                                  if (event.key.valueOf() === 'Enter')
                                    addRelated(index)
                                }}
                                isInvalid={!validateNewRelated()}
                              />
                            </Tooltip>
                            <Button
                              onClick={() => addRelated(index)}
                              isDisabled={!validateNewRelated()}
                              marginX={'50px'}
                              marginTop={'8px'}
                            >
                              Adicionar
                            </Button>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </WrapItem>
                  </Wrap>
                </Flex>
              </Box>
            ))}
            <Button onClick={addNewItem}>Adicionar item</Button>
          </VStack>
        </Box>
        <Box>
          <Text fontSize="18px" fontWeight="600" color="purple.800">
            Pagamento:
          </Text>
          <VStack spacing="4px" align="flex-start">
            {related.map((user, index) => (
              <Flex key={user}>
                <IdBox userId={user} marginRight="8px" marginLeft="16px" />
                <AmountInput
                  value={payers[index].amount.toFixed(2)}
                  onChange={val => updatePayer(index, parseFloat(val))}
                />
              </Flex>
            ))}
          </VStack>
        </Box>
        <HStack justify="center" align="center" spacing="8px">
          <Button onClick={handleCreateTransaction} isDisabled={!validated}>
            Criar Transação
          </Button>
          {!validated && (
            <Popover trigger="hover">
              <PopoverTrigger>
                <InfoOutlineIcon color="red.500" />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  <Alert status="error">
                    <AlertIcon color="red.500" />
                    <AlertTitle mr={4}>Error!</AlertTitle>
                    <AlertDescription textAlign="center">
                      {invalidItemsNamesIndexes.length > 0
                        ? `Itens com índices (${invalidItemsNamesIndexes}) estão com nomes duplicados`
                        : errorMessage}
                    </AlertDescription>
                  </Alert>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
        </HStack>
      </VStack>
    </Layout>
  )
}

export default CreateTransaction
