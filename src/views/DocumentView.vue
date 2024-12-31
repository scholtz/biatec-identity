<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Layout from '@/layouts/PublicLayout.vue'
import { useToast } from 'primevue/usetoast'
import { Form } from '@primevue/forms'

import { useAppStore } from '@/stores/app'
import { v7 as uuidv7 } from 'uuid'
import { useRoute, useRouter } from 'vue-router'
import type { IDocument } from '@/interface/IDocument'
import InputTextField from '@/components/form/InputTextField.vue'
import EnumSelectField from '@/components/form/EnumSelectField.vue'
import DateField from '@/components/form/DateField.vue'

const store = useAppStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  var id = route.params['id'] as string
  if (id) {
    if (store.state.userInput.documents[id]) {
      state.obj = { ...store.state.userInput.documents[id] }
    }
  }
})

const resolver = () => {
  const errors: any = {}

  if (!state.obj.name) {
    errors.name = [
      {
        message: 'Please define the document name so that you can reference it with other entities.'
      }
    ]
  }
  if (!state.obj.documentId) {
    errors.documentId = [{ message: 'Document identification is required.' }]
  }
  if (!state.obj.issuedBy) {
    errors.issuedBy = [{ message: 'Document issuer is required.' }]
  }
  if (Object.keys(errors).length > 0) console.error('form errors', errors)
  return {
    errors
  }
}
const onFormSubmit = ({ valid }) => {
  console.log('onFormSubmit', valid, state.obj, store.state.userInput)
  if (valid) {
    let id = route.params['id'] as string
    if (!id) id = uuidv7()
    store.state.userInput.documents[id] = state.obj
    toast.add({ severity: 'success', summary: 'Form has been submitted', life: 3000 })
    router.push('/user-input-overview')
  } else {
    toast.add({ severity: 'error', summary: 'The form contains the error', life: 3000 })
  }
}

const goBack = () => {
  router.push('/user-input-overview')
}

const defaultObj: IDocument = {
  type: undefined,
  name: '',
  documentId: '',
  issuedBy: '',
  dateOfIssue: undefined,
  dateOfExpiry: undefined
}
const state = reactive({
  obj: defaultObj
})
</script>

<template>
  <Layout>
    <Form v-slot="$form" :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <Fieldset
        legend="Document data"
        class="m-6 gap-6 flex flex-col"
        pt:content:class="flex gap-2 flex flex-col"
      >
        <Fieldset
          legend="Meta information"
          class="m-6 gap-6 flex flex-col"
          pt:content:class="flex gap-2 flex flex-col"
        >
          <EnumSelectField
            fieldName="type"
            v-model="state.obj.type"
            helpText="Type of the document you want to register."
            labelText="Document type"
            enum="DOCUMENT_TYPE"
          />
          <InputTextField
            fieldName="name"
            v-model="state.obj.name"
            helpText="Name of the document so that you can reference it later with other entities."
            labelText="Name"
          />
          <InputTextField
            fieldName="documentId"
            v-model="state.obj.documentId"
            helpText="Please provide the identification of the document."
            labelText="Document ID"
          />
          <InputTextField
            fieldName="issuedBy"
            v-model="state.obj.issuedBy"
            helpText="Please provide information who issued the document."
            labelText="Document issuer"
          />
          <DateField
            fieldName="dateOfIssue"
            v-model="state.obj.dateOfIssue"
            helpText="When was the document issued?"
            labelText="Date of issuance"
          />
          <DateField
            fieldName="dateOfExpiry"
            v-model="state.obj.dateOfExpiry"
            helpText="If there is date of expiry stated on the document, please fill in this field."
            labelText="Date of expiry"
          />
        </Fieldset>

        <Button type="submit" severity="primary" label="Save document" />
        <Button severity="secondary" label="Close without saving" @click="goBack" />
      </Fieldset>
    </Form>
  </Layout>
</template>
