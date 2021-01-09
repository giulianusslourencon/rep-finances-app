import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Wrap,
  StackDivider,
  VStack,
  WrapItem,
  CloseButton,
  Tooltip,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ButtonGroup,
  Button
} from '@chakra-ui/react'
import moment from 'moment'
import Router from 'next/router'
import React, { useState } from 'react'
import DatePicker from 'react-datetime'
import 'react-datetime/css/react-datetime.css'

import AmountInput from '@components/AmountInput'
import ErrorPopup from '@components/ErrorPopup'
import IdBox from '@components/IdBox'
import LabelInput from '@components/LabelInput'
import Layout from '@components/Layout'
import Text from '@components/Text'

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
  const [selectedItemIndex, setSelectedItemIndex] = useState(0)

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose
  } = useDisclosure()

  const [errors, setErrors] = useState(
    [] as { name: string; message: string }[]
  )

  const [awaitingRequest, setAwaitingRequest] = useState(false)

  const formatAmount = (val: number) => (val / 100).toFixed(2)
  const parseAmount = (val: string) => parseFloat(val.replace(/[.]/, '') || '0')

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
    setPayers(
      currentPayers.sort((a, b) => {
        if (a.userId < b.userId) return -1
        if (a.userId > b.userId) return 1
        return 0
      })
    )
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
          amount: item.amount / 100,
          related_users: item.related_users
        })
    )

    const objPayers = {} as { [userId: string]: number }
    payers.forEach(payer => {
      if (payer.amount) objPayers[payer.userId] = payer.amount / 100
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
    if (validated && !awaitingRequest) {
      try {
        setAwaitingRequest(true)
        const response = await API.post('/transactions', transaction)
        Router.push(`/transactions/item/${response.data._id}`)
      } catch (error) {
        const errorMessage = error.response?.data || {
          name: error.code,
          message: error.message
        }
        setErrors([errorMessage])
        setAwaitingRequest(false)
      }
    }
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={onModalClose} motionPreset="scale">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="md" textAlign="center" color="purple.800">
              Adicionar usuários relacionados
            </Heading>
          </ModalHeader>
          <ModalBody pb={6}>
            <LabelInput
              value={newRelated}
              placeholder="Id do Usuário"
              minLength={1}
              maxLength={2}
              onChange={val =>
                setNewRelated(val.target.value.trim().toUpperCase())
              }
              onKeyDown={event => {
                if (event.key.valueOf() === 'Enter')
                  addRelated(selectedItemIndex)
              }}
              isInvalid={!validateNewRelated()}
            />
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <Button
                onClick={() => addRelated(selectedItemIndex)}
                isDisabled={!validateNewRelated()}
              >
                Adicionar
              </Button>
              <Button variant="outline" onClick={onModalClose}>
                Cancelar
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Layout buttons={[{ title: 'Voltar', href: '/' }]}>
        <VStack
          divider={<StackDivider borderColor="purple.800" />}
          spacing={2}
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
                <Text fontSize="lg">Título:</Text>
                <LabelInput
                  width="12.5rem"
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
                <Text fontSize="lg">Data/Hora:</Text>
                <DatePicker
                  dateFormat="DD-MM-YYYY"
                  timeFormat="hh:mm A"
                  inputProps={{
                    style: {
                      backgroundColor: '#E6FB71',
                      borderBottom: '1px solid #CB60D3',
                      width: '12.5rem',
                      fontSize: 'lg'
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
            <Text fontSize="lg">Itens:</Text>
            <VStack spacing={1}>
              {items.map((item, index) => (
                <Box
                  key={index}
                  borderRadius="1rem"
                  borderColor="purple.400"
                  borderWidth="1px"
                  padding={4}
                  width="18.125rem"
                >
                  <Flex justify="space-between" align="center" marginBottom={2}>
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
                        value={formatAmount(items[index].amount)}
                        onChange={val =>
                          updateItem(index, {
                            amount: parseAmount(val)
                          })
                        }
                        isInvalid={!validateAmount(items[index].amount)}
                        marginRight={2}
                      />
                    </Tooltip>
                    <Wrap spacing={1} justify="flex-end" align="center">
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
                        <IdBox
                          as="button"
                          onClick={() => {
                            onModalOpen()
                            setSelectedItemIndex(index)
                          }}
                          userId={'+'}
                        />
                      </WrapItem>
                    </Wrap>
                  </Flex>
                </Box>
              ))}
              <Button onClick={addNewItem}>Adicionar item</Button>
            </VStack>
          </Box>
          <Box>
            <Text fontSize="lg">Pagamento:</Text>
            <VStack spacing={1} align="flex-start">
              {related.map((user, index) => (
                <Flex key={user}>
                  <IdBox userId={user} marginRight={2} marginLeft={4} />
                  <AmountInput
                    value={formatAmount(payers[index].amount)}
                    onChange={val => updatePayer(index, parseAmount(val))}
                  />
                </Flex>
              ))}
            </VStack>
          </Box>
          <HStack justify="center" align="center" spacing={2}>
            <Button
              isLoading={awaitingRequest}
              loadingText="Criando..."
              onClick={handleCreateTransaction}
              isDisabled={!validated || awaitingRequest}
            >
              Criar Transação
            </Button>
            {!validated && (
              <Popover trigger="hover">
                <PopoverTrigger>
                  <InfoOutlineIcon color="red.500" cursor="help" />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverBody>
                    <ErrorPopup
                      error={{
                        name: 'Erro!',
                        message:
                          invalidItemsNamesIndexes.length > 0
                            ? `Itens com índices (${invalidItemsNamesIndexes}) estão com nomes duplicados`
                            : errorMessage || ''
                      }}
                    />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            )}
          </HStack>
        </VStack>
      </Layout>
    </>
  )
}

export default CreateTransaction
