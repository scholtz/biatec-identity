<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Layout from '@/layouts/PublicLayout.vue'
import { useToast } from 'primevue/usetoast'
import { Form } from '@primevue/forms'

import { useAppStore } from '@/stores/app'
import { v7 as uuidv7 } from 'uuid'
import { useRoute, useRouter } from 'vue-router'
import InputTextField from '@/components/form/InputTextField.vue'
import type { ITelegram } from '@/interface/ITelegram'
import type { IXAccount } from '@/interface/IXAccount'

const store = useAppStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  var id = route.params['id'] as string
  if (id) {
    if (store.state.userInput.xAccounts[id]) {
      state.obj = { ...store.state.userInput.xAccounts[id] }
    }
  }
})

const resolver = () => {
  const errors: any = {}

  if (!state.obj.xAccount) {
    errors.xAccount = [{ message: 'X account is required.' }]
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
    store.state.userInput.xAccounts[id] = state.obj
    toast.add({ severity: 'success', summary: 'Form has been submitted', life: 3000 })
    router.push('/user-input-overview')
  } else {
    toast.add({ severity: 'error', summary: 'The form contains the error', life: 3000 })
  }
}

const goBack = () => {
  router.push('/user-input-overview')
}

const defaultObj: IXAccount = {
  xAccount: ''
}
const state = reactive({
  obj: defaultObj
})
</script>

<template>
  <Layout>
    <Form v-slot="$form" :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <Fieldset
        legend="X account data"
        class="m-6 gap-6 flex flex-col"
        pt:content:class="flex gap-2 flex flex-col"
      >
        <Fieldset
          legend="Basic info"
          class="m-6 gap-6 flex flex-col"
          pt:content:class="flex gap-2 flex flex-col"
        >
          <InputTextField
            fieldName="xAccount"
            v-model="state.obj.xAccount"
            helpText="X account name."
            labelText="X account"
          />
        </Fieldset>

        <Button type="submit" severity="primary" label="Save the X account" />
        <Button severity="secondary" label="Close without saving" @click="goBack" />
      </Fieldset>
    </Form>
  </Layout>
</template>
