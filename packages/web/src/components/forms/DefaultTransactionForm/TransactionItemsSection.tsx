/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem
} from '@chakra-ui/react'
import { Field, FieldArray } from 'formik'
import React from 'react'

import { TransactionItemForm } from '@components/forms'
import { RelatedModal } from '@components/overlay'

import { AmountInput, LabelInput } from '@modules/forms'
import { IdBox } from '@modules/resource'

import { validateAmount, validateLabel } from '@utils/validateTransaction'

type TransactionItemsProps = {
  items: TransactionItemForm[]
  related: string[]
  setFieldValue: (field: string, value: any) => void
  addRelated: (user: string) => void
}

export const getBaseItem = (): TransactionItemForm => {
  return {
    itemName: '',
    related_users: [],
    price: 0,
    quantity: 1
  }
}

export const TransactionItemsSection: React.FC<TransactionItemsProps> = ({
  items,
  related,
  setFieldValue,
  addRelated
}) => {
  const validateItemName = (itemName: string) => {
    if (!validateLabel(itemName))
      return 'Nome do item deve conter entre 2 e 255 caracteres'
    if (
      items.filter(
        item =>
          item.itemName.trim().toLowerCase() === itemName.trim().toLowerCase()
      ).length > 1
    )
      return 'Nome duplicado'
    return undefined
  }

  const validateItemPrice = (itemPrice: number) => {
    if (!validateAmount(itemPrice))
      return 'Valor do item deve ser maior do que 0'
    return undefined
  }

  const validateItemQuantity = (itemQuantity: number) => {
    if (!validateAmount(itemQuantity))
      return 'Quantidade do item deve ser um inteiro positivo'
    return undefined
  }

  const formatPrice = (val: number) => (val / 100).toFixed(2)
  const parsePrice = (val: string) => parseFloat(val.replace(/[.]/, '') || '0')

  const relatedModalDisclosure = useDisclosure()

  return (
    <Box>
      <RelatedModal
        disclosure={relatedModalDisclosure}
        onAdd={addRelated}
        related={related}
      />
      <Text fontSize="lg">Itens:</Text>
      <FieldArray
        name="items"
        render={itemsArrayHelper => (
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
                  <Field
                    name={`items.${index}.itemName`}
                    validate={validateItemName}
                  >
                    {({ field, form }: any) => (
                      <Tooltip
                        shouldWrapChildren
                        label="Nome do item"
                        openDelay={500}
                        hasArrow
                        placement="top"
                      >
                        <FormControl
                          isRequired={true}
                          isInvalid={
                            form.errors.items &&
                            form.errors.items[index]?.itemName &&
                            form.touched.items &&
                            form.touched.items[index]?.itemName
                          }
                          justifyContent="stretch"
                          mr={4}
                        >
                          <LabelInput {...field} placeholder="Item" />
                          <FormErrorMessage color="red.500">
                            {form.errors.items
                              ? form.errors.items[index]?.itemName
                              : ''}
                          </FormErrorMessage>
                        </FormControl>
                      </Tooltip>
                    )}
                  </Field>
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
                      onClick={() => itemsArrayHelper.remove(index)}
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
                      <Field
                        name={`items.${index}.quantity`}
                        validate={validateItemQuantity}
                      >
                        {({ field, form }: any) => (
                          <FormControl
                            isRequired={true}
                            isInvalid={
                              form.errors.items &&
                              form.errors.items[index]?.quantity &&
                              form.touched.items &&
                              form.touched.items[index]?.quantity
                            }
                          >
                            <AmountInput
                              value={field.value}
                              onChange={(_, val) =>
                                setFieldValue(`items.${index}.quantity`, val)
                              }
                              min={1}
                              precision={0}
                              fieldProps={{ width: 9, textAlign: 'center' }}
                            />
                            <FormErrorMessage color="red.500">
                              {form.errors.items
                                ? form.errors.items[index]?.quantity
                                : ''}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Text variant="thin" fontSize="sm" marginRight={0.5}>
                        x
                      </Text>
                      <Field
                        name={`items.${index}.price`}
                        validate={validateItemPrice}
                      >
                        {({ field, form }: any) => (
                          <FormControl
                            isRequired={true}
                            isInvalid={
                              form.errors.items &&
                              form.errors.items[index]?.price &&
                              form.touched.items &&
                              form.touched.items[index]?.price
                            }
                          >
                            <AmountInput
                              value={formatPrice(field.value)}
                              onChange={val =>
                                setFieldValue(
                                  `items.${index}.price`,
                                  parsePrice(val)
                                )
                              }
                              marginRight={2}
                            />
                            <FormErrorMessage color="red.500">
                              {form.errors.items
                                ? form.errors.items[index]?.price
                                : ''}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </HStack>
                  </Tooltip>
                  <FieldArray
                    name={`items.${index}.related_users`}
                    render={userArrayHelper => (
                      <Wrap spacing={1} justify="flex-end" align="center">
                        {related.map(user => (
                          <WrapItem key={user}>
                            <IdBox
                              userId={user}
                              onClick={() => {
                                const index = item.related_users.indexOf(user)
                                index >= 0
                                  ? userArrayHelper.remove(index)
                                  : userArrayHelper.push(user)
                              }}
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
                            onClick={relatedModalDisclosure.onOpen}
                            userId={'+'}
                          />
                        </WrapItem>
                      </Wrap>
                    )}
                  />
                </Flex>
              </Box>
            ))}
            <Button onClick={() => itemsArrayHelper.push(getBaseItem())}>
              Adicionar item
            </Button>
          </VStack>
        )}
      />
    </Box>
  )
}
