/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select
} from '@chakra-ui/react'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import React from 'react'

import { FullNumberInput } from '@modules/forms'

type DisclosureProps = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

type DateProps = {
  day: number
  month: number
  year: number
  hour: number
  minute: number
}

type DateModalProps = {
  disclosure: DisclosureProps
  initialDate: Date
  onChange: (value: number) => void
}

export const DateModal: React.FC<DateModalProps> = ({
  disclosure,
  initialDate,
  onChange
}) => {
  return (
    <Modal
      isOpen={disclosure.isOpen}
      onClose={disclosure.onClose}
      motionPreset="scale"
    >
      <ModalOverlay />
      <Formik
        initialValues={{
          year: initialDate.getFullYear(),
          month: initialDate.getMonth(),
          day: initialDate.getDate(),
          hour: initialDate.getHours(),
          minute: initialDate.getMinutes()
        }}
        onSubmit={(
          values: DateProps,
          { setSubmitting }: FormikHelpers<DateProps>
        ) => {
          onChange(
            new Date(
              values.year,
              values.month,
              values.day,
              values.hour,
              values.minute
            ).valueOf()
          )
          setSubmitting(false)
          disclosure.onClose()
        }}
      >
        {props => (
          <Form>
            <ModalContent>
              <ModalHeader>
                <Heading size="md" textAlign="center" color="purple.800">
                  Data e Horário da Transação
                </Heading>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <Field name="day">
                  {({ field }: any) => (
                    <FormControl id="transactionDay" display="flex">
                      <FormLabel width="7.5rem" fontSize="lg">
                        Dia:
                      </FormLabel>
                      <FullNumberInput
                        value={field.value}
                        onChange={(_, val) => props.setFieldValue('day', val)}
                        min={1}
                        max={31}
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="month">
                  {({ field }: any) => (
                    <FormControl id="transactionMonth" display="flex">
                      <FormLabel width="7.5rem" fontSize="lg">
                        Mês:
                      </FormLabel>
                      <Select
                        value={field.value}
                        onChange={e =>
                          props.setFieldValue('month', parseInt(e.target.value))
                        }
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
                  )}
                </Field>
                <Field name="year">
                  {({ field }: any) => (
                    <FormControl id="transactionYear" display="flex">
                      <FormLabel width="7.5rem" fontSize="lg">
                        Ano:
                      </FormLabel>
                      <FullNumberInput
                        value={field.value}
                        onChange={(_, val) => props.setFieldValue('year', val)}
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="hour">
                  {({ field }: any) => (
                    <FormControl id="transactionHour" display="flex">
                      <FormLabel width="7.5rem" fontSize="lg">
                        Hora:
                      </FormLabel>
                      <FullNumberInput
                        value={field.value}
                        onChange={(_, val) => props.setFieldValue('hour', val)}
                        min={0}
                        max={23}
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="minute">
                  {({ field }: any) => (
                    <FormControl id="transactionMinute" display="flex">
                      <FormLabel width="7.5rem" fontSize="lg">
                        Minutos:
                      </FormLabel>
                      <FullNumberInput
                        value={field.value}
                        onChange={(_, val) =>
                          props.setFieldValue('minute', val)
                        }
                        min={0}
                        max={59}
                      />
                    </FormControl>
                  )}
                </Field>
              </ModalBody>
              <ModalFooter>
                <ButtonGroup alignItems="center">
                  {/* <Button variant="outline" size="sm">
                    Agora
                  </Button> */}
                  <Button type="submit">Atualizar</Button>
                  <Button variant="outline" onClick={disclosure.onClose}>
                    Cancelar
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </ModalContent>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}
