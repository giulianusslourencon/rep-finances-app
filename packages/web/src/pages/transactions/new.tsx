import {
  Box,
  Flex,
  Wrap,
  StackDivider,
  VStack,
  HStack,
  WrapItem,
  CloseButton,
  Tooltip,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ButtonGroup,
  Button,
  Text,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  FormErrorMessage
} from '@chakra-ui/react'
import Router from 'next/router'
import React, { useState } from 'react'

import AmountInput from '@components/AmountInput'
import ErrorPopup from '@components/ErrorPopup'
import IdBox from '@components/IdBox'
import LabelInput from '@components/LabelInput'
import Layout from '@components/Layout'

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
  amount: [number, number]
}

type TransactionPayer = {
  userId: string
  amount: number
}

const CreateTransaction: React.FC = () => {
  const baseItem: TransactionItem = {
    itemName: '',
    related_users: [],
    amount: [1, 0]
  }

  const formatDate = (val: number | Date) =>
    new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      formatMatcher: 'best fit'
    }).format(val)

  const [title, setTitle] = useState('')
  const [timestamp, setTimestamp] = useState(Date.now())

  const [items, setItems] = useState([{ ...baseItem }])
  const [invalidItemsNamesIndexes, setInvalidItemsNamesIndexes] = useState(
    [] as number[]
  )

  const [payers, setPayers] = useState([] as TransactionPayer[])

  const [related, setRelated] = useState([] as string[])
  const [newRelated, setNewRelated] = useState('')
  const [selectedItemIndex, setSelectedItemIndex] = useState(0)

  const [transactionDay, setTransactionDay] = useState(
    new Date(timestamp).getDate()
  )

  const [transactionMonth, setTransactionMonth] = useState(
    new Date(timestamp).getMonth()
  )

  const [transactionYear, setTransactionYear] = useState(
    new Date(timestamp).getFullYear()
  )

  const [transactionHour, setTransactionHour] = useState(
    new Date(timestamp).getHours()
  )

  const [transactionMinute, setTransactionMinute] = useState(
    new Date(timestamp).getMinutes()
  )

  const {
    isOpen: isRelatedModalOpen,
    onOpen: onRelatedModalOpen,
    onClose: onRelatedModalClose
  } = useDisclosure()

  const {
    isOpen: isDateModalOpen,
    onOpen: onDateModalOpen,
    onClose: onDateModalClose
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
      [itemName: string]: {
        related_users: string[]
        amount: number
      }
    }
    items.map(
      item =>
        (objItems[item.itemName] = {
          amount: (item.amount[0] * item.amount[1]) / 100,
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

  const itemsValues = +items
    .reduce((acc, cur) => acc + cur.amount[0] * cur.amount[1], 0)
    .toFixed(2)
  const totalPaid = +payers.reduce((acc, cur) => acc + cur.amount, 0).toFixed(2)

  const transaction = getTransactionObject()
  let validated = validateTransaction(transaction)

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
      <Modal
        isOpen={isRelatedModalOpen}
        onClose={onRelatedModalClose}
        motionPreset="scale"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="md" textAlign="center" color="purple.800">
              Adicionar usuários relacionados
            </Heading>
          </ModalHeader>
          <ModalBody pb={6}>
            <FormControl
              id="newRelated"
              isRequired={true}
              isInvalid={!validateNewRelated()}
            >
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
              />
              <FormErrorMessage color="red.500">
                Campo deve conter ao menos um caracter, não pode conter
                caracteres especiais e não pode iniciar com um número
              </FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <Button
                onClick={() => {
                  addRelated(selectedItemIndex)
                  onRelatedModalClose()
                }}
                isDisabled={!validateNewRelated()}
              >
                Adicionar
              </Button>
              <Button variant="outline" onClick={onRelatedModalClose}>
                Cancelar
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDateModalOpen}
        onClose={onDateModalClose}
        motionPreset="scale"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="md" textAlign="center" color="purple.800">
              Data e Horário da Transação
            </Heading>
          </ModalHeader>
          <ModalBody pb={6}>
            <FormControl id="transactionDay" display="flex">
              <FormLabel width="7.5rem" fontSize="lg">
                Dia:
              </FormLabel>
              <NumberInput
                value={transactionDay}
                onChange={(_, val) => setTransactionDay(val)}
                min={1}
                max={31}
                allowMouseWheel
                variant="flushed"
                borderColor="purple.400"
                focusBorderColor="purple.600"
                size="sm"
                width="100%"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl id="transactionMonth" display="flex">
              <FormLabel width="7.5rem" fontSize="lg">
                Mês:
              </FormLabel>
              <Select
                value={transactionMonth}
                onChange={e => setTransactionMonth(parseInt(e.target.value))}
                allowMouseWheel
                variant="flushed"
                borderColor="purple.400"
                focusBorderColor="purple.600"
                size="sm"
              >
                <option value="0">Janeiro</option>
                <option value="1">Fevereiro</option>
                <option value="2">Março</option>
                <option value="3">Abril</option>
                <option value="4">Maio</option>
                <option value="5">Junho</option>
                <option value="6">Julho</option>
                <option value="7">Agosto</option>
                <option value="8">Setembro</option>
                <option value="9">Outubro</option>
                <option value="10">Novembro</option>
                <option value="11">Dezembro</option>
              </Select>
            </FormControl>
            <FormControl id="transactionYear" display="flex">
              <FormLabel width="7.5rem" fontSize="lg">
                Ano:
              </FormLabel>
              <NumberInput
                value={transactionYear}
                onChange={(_, val) => setTransactionYear(val)}
                allowMouseWheel
                variant="flushed"
                borderColor="purple.400"
                focusBorderColor="purple.600"
                size="sm"
                width="100%"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl id="transactionHour" display="flex">
              <FormLabel width="7.5rem" fontSize="lg">
                Hora:
              </FormLabel>
              <NumberInput
                value={transactionHour}
                onChange={(_, val) => setTransactionHour(val)}
                min={0}
                max={23}
                allowMouseWheel
                variant="flushed"
                borderColor="purple.400"
                focusBorderColor="purple.600"
                size="sm"
                width="100%"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl id="transactionMinute" display="flex">
              <FormLabel width="7.5rem" fontSize="lg">
                Minutos:
              </FormLabel>
              <NumberInput
                value={transactionMinute}
                onChange={(_, val) => setTransactionMinute(val)}
                min={0}
                max={59}
                allowMouseWheel
                variant="flushed"
                borderColor="purple.400"
                focusBorderColor="purple.600"
                size="sm"
                width="100%"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup alignItems="center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const date = new Date()
                  setTransactionDay(date.getDate())
                  setTransactionMonth(date.getMonth())
                  setTransactionYear(date.getFullYear())
                  setTransactionHour(date.getHours())
                  setTransactionMinute(date.getMinutes())
                }}
              >
                Agora
              </Button>
              <Button
                onClick={() => {
                  setTimestamp(
                    new Date(
                      transactionYear,
                      transactionMonth,
                      transactionDay,
                      transactionHour,
                      transactionMinute
                    ).valueOf()
                  )
                  onDateModalClose()
                }}
              >
                Atualizar
              </Button>
              <Button variant="outline" onClick={onDateModalClose}>
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
              <FormControl
                id="transactionTitle"
                isRequired={true}
                isInvalid={!validateLabel(title)}
                mb={4}
              >
                <FormLabel width="7.5rem" fontSize="lg">
                  Título:
                </FormLabel>
                <LabelInput
                  placeholder="Título"
                  value={title}
                  onChange={val => setTitle(val.target.value)}
                />
                <FormErrorMessage color="red.500">
                  Título deve conter entre 2 e 255 caracteres
                </FormErrorMessage>
              </FormControl>
            </Tooltip>
            <Tooltip
              shouldWrapChildren
              label="Momento em que a transação aconteceu"
              openDelay={500}
              hasArrow
              placement="top"
            >
              <FormControl
                id="transactionDate"
                isRequired={true}
                justifyContent="stretch"
              >
                <FormLabel width="7.5rem" fontSize="lg">
                  Data/Hora:
                </FormLabel>
                <LabelInput
                  readOnly
                  value={formatDate(timestamp)}
                  onClick={onDateModalOpen}
                  cursor="pointer"
                />
              </FormControl>
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
                      <FormControl
                        id={`itemName ${index}`}
                        isRequired={true}
                        isInvalid={
                          !validateLabel(item.itemName) ||
                          invalidItemsNamesIndexes.includes(index)
                        }
                        justifyContent="stretch"
                        mr={4}
                      >
                        <LabelInput
                          placeholder="Item"
                          value={item.itemName}
                          onChange={val =>
                            updateItem(index, { itemName: val.target.value })
                          }
                        />
                        <FormErrorMessage color="red.500">
                          {invalidItemsNamesIndexes.includes(index)
                            ? 'Nome duplicado'
                            : 'Nome do item deve conter entre 2 e 255 caracteres'}
                        </FormErrorMessage>
                      </FormControl>
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
                      <HStack>
                        <FormControl
                          id={`itemQuantity ${index}`}
                          isRequired={true}
                          isInvalid={!validateAmount(item.amount[0])}
                        >
                          <AmountInput
                            value={item.amount[0]}
                            onChange={(_, val) =>
                              updateItem(index, {
                                amount: [val || 0, item.amount[1]]
                              })
                            }
                            min={1}
                            precision={0}
                            fieldProps={{ width: 8, textAlign: 'center' }}
                          />
                          <FormErrorMessage color="red.500">
                            Quantidade do item deve ser um inteiro positivo
                          </FormErrorMessage>
                        </FormControl>
                        <Text variant="thin" fontSize="sm" marginRight={0.5}>
                          x
                        </Text>
                        <FormControl
                          id={`itemAmount ${index}`}
                          isRequired={true}
                          isInvalid={!validateAmount(item.amount[1])}
                        >
                          <AmountInput
                            value={formatAmount(item.amount[1])}
                            onChange={val =>
                              updateItem(index, {
                                amount: [item.amount[0], parseAmount(val)]
                              })
                            }
                            marginRight={2}
                          />
                          <FormErrorMessage color="red.500">
                            Valor do item deve ser maior do que 0
                          </FormErrorMessage>
                        </FormControl>
                      </HStack>
                    </Tooltip>
                    <Wrap spacing={1} justify="flex-end" align="center">
                      {related.map(user => (
                        <WrapItem key={user}>
                          <IdBox
                            userId={user}
                            onClick={() => changeUserOnItem(index, user)}
                            variant={
                              item.related_users.includes(user)
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
                            onRelatedModalOpen()
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
            <FormControl isInvalid={itemsValues !== totalPaid}>
              <VStack spacing={1} ml={4} align="flex-start">
                {related.map((user, index) => (
                  <HStack key={user} spacing={4}>
                    <IdBox userId={user} />
                    <AmountInput
                      value={formatAmount(payers[index].amount)}
                      onChange={val => updatePayer(index, parseAmount(val))}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updatePayer(
                          index,
                          payers[index].amount + itemsValues - totalPaid
                        )
                      }
                      isDisabled={itemsValues === totalPaid}
                    >
                      Completar
                    </Button>
                  </HStack>
                ))}
              </VStack>
              <FormErrorMessage>
                Valor dos itens deve ser o mesmo que o total pago
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Button
            isLoading={awaitingRequest}
            loadingText="Criando..."
            onClick={handleCreateTransaction}
            isDisabled={!validated || awaitingRequest}
          >
            Criar Transação
          </Button>
        </VStack>
      </Layout>
    </>
  )
}

export default CreateTransaction
