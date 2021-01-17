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
  Button,
  Text,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select
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
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <Button
                onClick={() => addRelated(selectedItemIndex)}
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
            <FormControl id="transactionDay" isRequired={true} display="flex">
              <FormLabel width="7.5rem" fontSize="lg">
                Dia:
              </FormLabel>
              <NumberInput
                defaultValue={transactionDay}
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
            <FormControl id="transactionMonth" isRequired={true} display="flex">
              <FormLabel width="7.5rem" fontSize="lg">
                Mês:
              </FormLabel>
              <Select
                defaultValue={transactionMonth}
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
            <FormControl id="transactionYear" isRequired={true} display="flex">
              <FormLabel width="7.5rem" fontSize="lg">
                Ano:
              </FormLabel>
              <NumberInput
                defaultValue={transactionYear}
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
            <FormControl id="transactionHour" isRequired={true} display="flex">
              <FormLabel width="7.5rem" fontSize="lg">
                Hora:
              </FormLabel>
              <NumberInput
                defaultValue={transactionHour}
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
            <FormControl
              id="transactionMinute"
              isRequired={true}
              display="flex"
            >
              <FormLabel width="7.5rem" fontSize="lg">
                Minutos:
              </FormLabel>
              <NumberInput
                defaultValue={transactionMinute}
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
            <ButtonGroup>
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
                display="flex"
              >
                <FormLabel width="7.5rem" fontSize="lg">
                  Título:
                </FormLabel>
                <LabelInput
                  placeholder="Título"
                  value={title}
                  onChange={val => setTitle(val.target.value)}
                />
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
                display="flex"
                justifyContent="stretch"
              >
                <FormLabel width="7.5rem" fontSize="lg">
                  Data/Hora:
                </FormLabel>
                <LabelInput
                  readOnly
                  value={formatDate(timestamp)}
                  onClick={onDateModalOpen}
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
