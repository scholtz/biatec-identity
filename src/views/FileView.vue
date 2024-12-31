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
import type { IFile } from '@/interface/IFile'
import type { FileUploadBeforeSendEvent, FileUploadUploadEvent } from 'primevue/fileupload'
import { VueFilesPreview } from 'vue-files-preview'
import axios from 'axios'
const store = useAppStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

const uploadFile = ref<File | undefined>()

onMounted(() => {
  var id = route.params['id'] as string
  if (id) {
    if (store.state.userInput.files[id]) {
      state.obj = { ...store.state.userInput.files[id] }
    }
  }
})

const resolver = () => {
  const errors: any = {}

  if (!state.obj.name) {
    errors.name = [
      {
        message:
          'Please define the file reference name so that you can bind it with other entities.'
      }
    ]
  }
  if (!state.obj.type) {
    errors.type = [{ message: 'File is missing.' }]
  }
  if (!state.obj.fileId) {
    errors.fileId = [{ message: 'File is missing.' }]
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
    store.state.userInput.files[id] = state.obj
    toast.add({ severity: 'success', summary: 'Form has been submitted', life: 3000 })
    router.push('/user-input-overview')
  } else {
    toast.add({ severity: 'error', summary: 'The form contains the error', life: 3000 })
  }
}

const goBack = () => {
  router.push('/user-input-overview')
}

const defaultObj: IFile = {
  name: '',
  note: '',
  fileId: '',
  type: undefined
}
const state = reactive({
  obj: defaultObj
})

const onAdvancedUpload = (e: FileUploadUploadEvent) => {
  console.log('e', e)
  if (e.xhr.status == 200) {
    state.obj.fileId = e.xhr.responseText
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 })
  } else {
    toast.add({
      severity: 'error',
      summary: `File upload failed with code ${e.xhr.status}`,
      life: 3000
    })
  }
}
const onBeforeSend = (e: FileUploadBeforeSendEvent) => {
  console.log('xhr', e.xhr)
  console.log('formData', e.formData)
  e.xhr.setRequestHeader('Authorization', store.state.authState.arc14Header)
  toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 })
}
const loadFile = async () => {
  const response = await axios.get(
    `${store.state.fileGateway}/v1/document/${state.obj.fileId}/download`,
    { responseType: 'blob', headers: { Authorization: store.state.authState.arc14Header } }
  )
  // Extract MIME type from response.headers
  const mimeType = response.headers['content-type'] || 'application/octet-stream'

  // Extract file name from Content-Disposition
  let fileName = 'downloaded-file' // Default file name
  const contentDisposition = response.headers['content-disposition']
  if (contentDisposition) {
    const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
    if (match && match[1]) {
      fileName = match[1].replace(/['"]/g, '') // Remove surrounding quotes
    }
  }

  // Convert Blob to File
  const blob = response.data // Already a Blob
  uploadFile.value = new File([blob], fileName, { type: mimeType })
  console.log('state.file', uploadFile.value)
}
const downloadFile = async () => {
  if (!uploadFile.value) {
    console.error('No file available to download.')
    return
  }

  const url = URL.createObjectURL(uploadFile.value) // Create a temporary URL
  const link = document.createElement('a') // Create a link element
  link.href = url
  link.download = uploadFile.value.name // Set the file name
  document.body.appendChild(link)
  link.click() // Programmatically click the link to trigger the download
  document.body.removeChild(link) // Clean up
  URL.revokeObjectURL(url) // Release the URL
}
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
            helpText="Please choose correctly what are you uploading. Some documents are two sided so you will have to upload the front side first and then back side."
            labelText="Type"
            enum="FILE_TYPE"
          />
          <InputTextField
            fieldName="name"
            v-model="state.obj.name"
            helpText="Name of the file so that you can reference it later with other entities."
            labelText="Name"
          />
          <InputTextField
            fieldName="note"
            v-model="state.obj.note"
            helpText="Any comment on the document you want to share to increase the information value."
            labelText="Comment"
          />

          <FileUpload
            name="file"
            :url="`${store.state.fileGateway}/v1/document/upload`"
            @upload="onAdvancedUpload($event)"
            @before-send="onBeforeSend"
            :multiple="false"
            :maxFileSize="1000000"
          >
            <template #empty>
              <span>Drag and drop files to here to upload.</span>
            </template>
          </FileUpload>
          <VueFilesPreview :file="uploadFile" :show-download="true" :show-fullscreen="true" />
          <Button v-if="!uploadFile" severity="secondary" @click="loadFile">Preview file</Button>
          <Button v-if="uploadFile" severity="secondary" @click="downloadFile">
            Download file
          </Button>
        </Fieldset>

        <Button type="submit" severity="primary" label="Save file" />
        <Button severity="secondary" label="Close without saving" @click="goBack" />
      </Fieldset>
    </Form>
  </Layout>
</template>
