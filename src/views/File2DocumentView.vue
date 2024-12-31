<script setup lang="ts">
import { ref, reactive, onMounted, toValue } from 'vue'
import Layout from '@/layouts/PublicLayout.vue'
import { useToast } from 'primevue/usetoast'
import { Form } from '@primevue/forms'

import { useAppStore } from '@/stores/app'
import { v7 as uuidv7 } from 'uuid'
import { useRoute, useRouter } from 'vue-router'
import type { IXAccount } from '@/interface/IXAccount'
import EnumSelectField from '@/components/form/EnumSelectField.vue'
import InputTextField from '@/components/form/InputTextField.vue'

import { xAccountFormatter } from '@/scripts/formatters/xAccountFormatter'
import { documentFormatter } from '@/scripts/formatters/documentFormatter'
import { fileFormatter } from '@/scripts/formatters/fileFormatter'
import type { IPersonXAccount } from '@/interface/IPersonXAccount'
import type { IDocumentFile } from '@/interface/IDocumentFile'
import type { IFile } from '@/interface/IFile'
const store = useAppStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  var id = route.params['id'] as string
  if (id) {
    if (store.state.userInput.files[id]) {
      state.objType = store.state.userInput.files[id]
      state.obj.fileId = id
    }
  }
  console.log('onMounted', id, store.state.userInput, state.obj)
})

const resolver = () => {
  const errors: any = {}

  if (!state.obj.documentId) {
    errors.documentId = [{ message: 'Document selection is required.' }]
  }

  if (Object.keys(errors).length > 0) console.error('form errors', errors)
  return {
    errors
  }
}
const onFormSubmit = ({ valid }) => {
  console.log('onFormSubmit', valid, state.obj, store.state.userInput)
  if (valid) {
    const id = uuidv7()
    store.state.userInput.documentsFiles[id] = state.obj
    toast.add({ severity: 'success', summary: 'Form has been submitted', life: 3000 })
  } else {
    toast.add({ severity: 'error', summary: 'The form contains the error', life: 3000 })
  }
}

const goBack = () => {
  router.push('/user-input-overview')
}

const defaultObjType: IFile = {
  type: undefined,
  name: '',
  fileId: '',
  note: ''
}
const defaultObj: IDocumentFile = {
  documentId: '',
  fileId: ''
}

const state = reactive({
  objType: defaultObjType,
  obj: defaultObj
})
</script>

<template>
  <Layout>
    <Form v-slot="$form" :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <Fieldset
        legend="Assign file to the document"
        class="m-6 gap-6 flex flex-col"
        pt:content:class="flex gap-2 flex flex-col"
      >
        <Fieldset
          v-if="state.objType"
          :legend="fileFormatter(state.objType)"
          class="m-6 gap-6 flex flex-col"
          pt:content:class="flex gap-2 flex flex-col"
        >
          <Fieldset
            v-if="state.objType"
            legend="Current relations"
            class="m-6 gap-6 flex flex-col"
            pt:content:class="flex gap-2 flex flex-col"
          >
            <div v-for="(documentFile, id) in store.state.userInput.documentsFiles">
              <div v-if="documentFile.fileId == state.obj.fileId">
                <span>
                  {{ documentFormatter(store.state.userInput.documents[documentFile.documentId]) }}
                </span>
                <Button
                  severity="secondary"
                  @click="delete store.state.userInput.documentsFiles[id]"
                  class="m-2"
                >
                  X
                </Button>
              </div>
            </div>
          </Fieldset>
          <EnumSelectField
            fieldName="documentId"
            v-model="state.obj.documentId"
            helpText="Select the document which is linked to this file."
            labelText="Document"
            enum="DOCUMENT"
          />
        </Fieldset>

        <Button
          type="submit"
          :severity="
            Object.values(store.state.userInput.documentsFiles).filter(
              (pa) => pa.fileId == state.obj.fileId
            ).length == 0
              ? 'primary'
              : 'secondary'
          "
          label="Save relation"
        />
        <Button
          :severity="
            state.obj.fileId &&
            Object.values(store.state.userInput.documentsFiles).filter(
              (pa) => pa.fileId == state.obj.fileId
            ).length > 0
              ? 'primary'
              : 'secondary'
          "
          label="Go to overview"
          @click="goBack"
        />
      </Fieldset>
    </Form>
  </Layout>
</template>
