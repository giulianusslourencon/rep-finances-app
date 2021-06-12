/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Tooltip,
  useDisclosure
} from '@chakra-ui/react'
import { Field } from 'formik'
import React from 'react'

import { DateModal } from '@components/modals'

import { LabelInput } from '@modules/forms'

import { validateLabel } from '@utils/validateTransaction'

export const TransactionInfoSection: React.FC<{
  setFieldValue: (field: string, value: any) => void
}> = ({ setFieldValue }) => {
  const validateTitle = (title: string) => {
    if (!validateLabel(title))
      return 'Título deve conter entre 2 e 255 caracteres'
    return undefined
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

  const dateModalDisclosure = useDisclosure()

  return (
    <Box>
      <Field name="info.title" validate={validateTitle}>
        {({ field, form }: any) => {
          return (
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
                isInvalid={form.errors.info?.title && form.touched.info?.title}
                mb={4}
              >
                <FormLabel width="7.5rem" fontSize="lg">
                  Título:
                </FormLabel>
                <LabelInput {...field} placeholder="Título" id="info.title" />
                <FormErrorMessage color="red.500">
                  {form.errors.info?.title}
                </FormErrorMessage>
              </FormControl>
            </Tooltip>
          )
        }}
      </Field>
      <Field name="info.timestamp">
        {({ field }: any) => {
          return (
            <>
              <DateModal
                disclosure={dateModalDisclosure}
                initialDate={new Date(field.value)}
                onUpdate={value => setFieldValue('info.timestamp', value)}
              />
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
                    name={field.name}
                    readOnly
                    value={formatDate(field.value)}
                    onClick={dateModalDisclosure.onOpen}
                    cursor="pointer"
                    id="info.timestamp"
                  />
                </FormControl>
              </Tooltip>
            </>
          )
        }}
      </Field>
    </Box>
  )
}
