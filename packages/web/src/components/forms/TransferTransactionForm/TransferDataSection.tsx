/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Text,
  VStack
} from '@chakra-ui/react'
import { FieldArray } from 'formik'
import React from 'react'

import { AmountInput } from '@modules/forms'
import { IdBox } from '@modules/resource'

type TransferDataProps = {
  setFieldValue: (field: string, value: any) => void
  related: string[]
}

export const TransferDataSection: React.FC<TransferDataProps> = ({
  setFieldValue,
  related
}) => {
  const formatAmount = (val: number) => (val / 100).toFixed(2)
  const parseAmount = (val: string) => parseFloat(val.replace(/[.]/, '') || '0')

  return (
    <Box>
      <Text fontSize="lg">Dados da Transferência:</Text>
    </Box>
  )
}
