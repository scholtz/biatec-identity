<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import Layout from '@/layouts/PublicLayout.vue'
import { useToast } from 'primevue/usetoast'
import { Form } from '@primevue/forms'

import { useAppStore } from '@/stores/app'
import { v7 as uuidv7 } from 'uuid'
import { useRoute, useRouter } from 'vue-router'

import InputTextField from '@/components/form/InputTextField.vue'
import CheckboxField from '@/components/form/CheckboxField.vue'
import type { IProof } from '@/interface/IProof'
import { phone } from 'phone'
import EnumSelectField from '@/components/form/EnumSelectField.vue'

const store = useAppStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  var id = route.params['id'] as string
  if (id) {
    if (store.state.userInput.proofs[id]) {
      state.obj = { ...store.state.userInput.proofs[id] }
    }
  }
})

const resolver = () => {
  const errors: any = {}

  if (!state.obj.proofType) {
    errors.proofType = [{ message: 'Proof type is required.' }]
  }
  if (!state.obj.documentId) {
    errors.documentId = [{ message: 'Please select the document for the proof.' }]
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
    store.state.userInput.proofs[id] = state.obj
    toast.add({ severity: 'success', summary: 'Form has been submitted', life: 3000 })
    router.push('/user-input-overview')
  } else {
    toast.add({ severity: 'error', summary: 'The form contains the error', life: 3000 })
  }
}

const goBack = () => {
  router.push('/user-input-overview')
}

const defaultObj: IProof = {
  proofType: undefined,
  documentId: '',
  note: ''
}
const state = reactive({
  obj: defaultObj
})
</script>

<template>
  <Layout>
    <Form v-slot="$form" :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <Fieldset
        legend="Proof data"
        class="m-6 gap-6 flex flex-col"
        pt:content:class="flex gap-2 flex flex-col"
      >
        <Fieldset
          legend="Proof basic information"
          class="m-6 gap-6 flex flex-col"
          pt:content:class="flex gap-2 flex flex-col"
        >
          <EnumSelectField
            fieldName="proofType"
            v-model="state.obj.proofType"
            helpText="Type of the proof which is described in the document."
            labelText="Type of the proof"
            enum="PROOF_TYPE"
          />
          <EnumSelectField
            fieldName="documentId"
            v-model="state.obj.documentId"
            helpText="The document which proofs legal claim."
            labelText="Document"
            enum="DOCUMENT"
          />

          <InputTextField
            fieldName="note"
            v-model="state.obj.note"
            helpText="Please write any comment to improve information about the document"
            labelText="Comment"
          />
        </Fieldset>

        <Button type="submit" severity="primary" label="Save proof" />
        <Button severity="secondary" label="Close without saving" @click="goBack" />
      </Fieldset>
    </Form>
  </Layout>
</template>
