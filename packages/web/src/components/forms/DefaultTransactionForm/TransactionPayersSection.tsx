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

import { TransactionPayerForm } from '@components/forms'

import { AmountInput } from '@modules/forms'
import { IdBox } from '@modules/resource'

type TransactionPayersProps = {
  payers: TransactionPayerForm[]
  setFieldValue: (field: string, value: any) => void
  amountDiff: number
}

export const TransactionPayersSection: React.FC<TransactionPayersProps> = ({
  payers,
  setFieldValue,
  amountDiff
}) => {
  const formatAmount = (val: number) => (val / 100).toFixed(2)
  const parseAmount = (val: string) => parseFloat(val.replace(/[.]/, '') || '0')

  const isInvalid = Math.abs(amountDiff) > 0.01

  return (
    <Box>
      <Text fontSize="lg">Pagamento:</Text>
      <FieldArray
        name="related"
        render={() => (
          <FormControl isInvalid={isInvalid}>
            <VStack spacing={1} ml={4} align="flex-start">
              {payers.map((user, index) => (
                <HStack key={user.userId} spacing={4}>
                  <IdBox userId={user.userId} />
                  <AmountInput
                    value={formatAmount(user.amount)}
                    onChange={val =>
                      setFieldValue(`related.${index}.amount`, parseAmount(val))
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFieldValue(
                        `related.${index}.amount`,
                        user.amount + amountDiff
                      )
                    }
                    isDisabled={!isInvalid}
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
        )}
      />
    </Box>
  )
}
