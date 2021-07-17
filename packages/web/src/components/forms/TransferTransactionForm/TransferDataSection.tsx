/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowForwardIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  Text,
  Tooltip,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import { Field, FieldArray } from 'formik'
import React from 'react'

import { RelatedModal, UserSelectPopover } from '@components/overlay'

import { AmountInput } from '@modules/forms'

import { validateAmount } from '@utils/validateTransaction'

type TransferDataProps = {
  setFieldValue: (field: string, value: any) => void
  related: string[]
  payer: string
  receiver: string
}

export const TransferDataSection: React.FC<TransferDataProps> = ({
  setFieldValue,
  related,
  payer,
  receiver
}) => {
  const formatAmount = (val: number) => (val / 100).toFixed(2)
  const parseAmount = (val: string) => parseFloat(val.replace(/[.]/, '') || '0')

  const validateTransferAmount = (itemPrice: number) => {
    if (!validateAmount(itemPrice))
      return 'Valor do item deve ser maior do que 0'
    return undefined
  }

  const validateId = (value: string, field: 'payer' | 'receiver') => {
    if (value === '?')
      return `Selecione um usuário válido para o ${
        field === 'payer' ? 'pagador' : 'recebedor'
      }`
    return undefined
  }

  const isInvalid = payer === receiver

  const relatedModalDisclosure = useDisclosure()

  return (
    <Box>
      <FieldArray
        name="related"
        render={relatedArrayHelper => (
          <>
            <RelatedModal
              disclosure={relatedModalDisclosure}
              onAdd={relatedArrayHelper.push}
              related={related}
            />
            <Text fontSize="lg">Dados da Transferência:</Text>
            <Box
              borderRadius="1rem"
              borderColor="purple.400"
              borderWidth="1px"
              padding={4}
              margin="0 auto"
              width="18.125rem"
            >
              <FormControl isInvalid={isInvalid}>
                <Flex justify="space-around">
                  <Field name="transfer.payer" validate={validateId}>
                    {({ form }: any) => (
                      <UserSelectPopover
                        selectedId={payer}
                        selectionList={related}
                        onSelectId={value => {
                          setFieldValue('transfer.payer', value)
                          if (!form.touched.info?.title) {
                            setFieldValue(
                              'info.title',
                              `Transferencia ${value}-${receiver}`
                            )
                          }
                        }}
                        relatedModalDisclosure={relatedModalDisclosure}
                      />
                    )}
                  </Field>
                  <Field
                    name="transfer.amount"
                    validate={validateTransferAmount}
                  >
                    {({ field, form }: any) => (
                      <FormControl
                        isRequired={true}
                        isInvalid={
                          form.errors.transfer?.amount &&
                          form.touched.transfer?.amount
                        }
                      >
                        <VStack>
                          <AmountInput
                            value={formatAmount(field.value)}
                            onChange={val =>
                              setFieldValue('transfer.amount', parseAmount(val))
                            }
                            display="flex"
                            justifyContent="center"
                          />
                          <Tooltip
                            shouldWrapChildren
                            label="O da esquerda pagou para o da direita"
                            openDelay={500}
                            hasArrow
                            placement="bottom"
                          >
                            <ArrowForwardIcon color="purple.800" />
                          </Tooltip>
                        </VStack>
                        <FormErrorMessage color="red.500">
                          {form.errors.transfer?.amount}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="transfer.receiver" validate={validateId}>
                    {({ form }: any) => (
                      <UserSelectPopover
                        selectedId={receiver}
                        selectionList={related}
                        onSelectId={value => {
                          setFieldValue('transfer.receiver', value)
                          if (!form.touched.info?.title) {
                            setFieldValue(
                              'info.title',
                              `Transferencia ${payer}-${value}`
                            )
                          }
                        }}
                        relatedModalDisclosure={relatedModalDisclosure}
                      />
                    )}
                  </Field>
                </Flex>
                <FormErrorMessage>
                  Os ids de pagador e recebedor não podem ser os mesmos
                </FormErrorMessage>
              </FormControl>
            </Box>
          </>
        )}
      />
    </Box>
  )
}
