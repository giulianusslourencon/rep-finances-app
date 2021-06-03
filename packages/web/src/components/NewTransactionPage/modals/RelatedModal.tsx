/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import React from 'react'

import { LabelInput } from '@modules/forms'

type DisclosureProps = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

type RelatedModalProps = {
  disclosure: DisclosureProps
  onAdd: (user: string) => void
}

type FormProps = {
  user: string
}

export const RelatedModal: React.FC<RelatedModalProps> = ({
  disclosure,
  onAdd
}) => {
  return (
    <Modal
      isOpen={disclosure.isOpen}
      onClose={disclosure.onClose}
      motionPreset="scale"
    >
      <ModalOverlay />
      <Formik
        initialValues={{ user: '' }}
        onSubmit={(
          values: FormProps,
          { setSubmitting }: FormikHelpers<FormProps>
        ) => {
          onAdd(values.user)
          setSubmitting(false)
          disclosure.onClose()
        }}
      >
        {props => (
          <Form>
            <ModalContent>
              <ModalHeader>
                <Heading size="md" textAlign="center" color="purple.800">
                  Adicionar usuários relacionados
                </Heading>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <Field name="user">
                  {({ field, form }: any) => (
                    <FormControl
                      id="newRelated"
                      isRequired={true}
                      isInvalid={form.errors.user && form.touched.user}
                    >
                      <LabelInput
                        {...field}
                        value={field.value.toUpperCase()}
                        placeholder="Id do Usuário"
                        minLength={1}
                        maxLength={2}
                        onKeyDown={event => {
                          if (event.key.valueOf() === 'Enter')
                            props.submitForm()
                        }}
                      />
                      <FormErrorMessage color="red.500">
                        {form.errors.user}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </ModalBody>
              <ModalFooter>
                <ButtonGroup>
                  <Button type="submit">Adicionar</Button>
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
