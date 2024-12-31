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
import type { IPhone } from '@/interface/IPhone'
import { phone } from 'phone'

const store = useAppStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  var id = route.params['id'] as string
  if (id) {
    if (store.state.userInput.phones[id]) {
      state.obj = { ...store.state.userInput.phones[id] }
    }
  }
})

const resolver = () => {
  const errors: any = {}

  if (!state.obj.countryDialingCode) {
    errors.countryDialingCode = [{ message: 'Dialing code is required.' }]
  }
  if (!state.obj.countryDialingCode.startsWith('+')) {
    errors.countryDialingCode = [{ message: 'Country dialing code must start with plus sign (+).' }]
  }
  if (!state.obj.phoneNumber) {
    errors.phoneNumber = [{ message: 'Phone number is required.' }]
  }
  const phoneCombined = `${state.obj.countryDialingCode}${state.obj.phoneNumber}`
  const phoneValidation = phone(phoneCombined, { strictDetection: true })
  if (!phoneValidation.isValid) {
    errors.phoneNumber = [
      {
        message: `Combination of dialing code and phone number (${phoneCombined}) is not valid phone number`
      }
    ]
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
    store.state.userInput.phones[id] = state.obj
    toast.add({ severity: 'success', summary: 'Form has been submitted', life: 3000 })
    router.push('/user-input-overview')
  } else {
    toast.add({ severity: 'error', summary: 'The form contains the error', life: 3000 })
  }
}

const goBack = () => {
  router.push('/user-input-overview')
}

const defaultObj: IPhone = {
  countryDialingCode: '',
  phoneNumber: '',
  canReceiveSMS: false
}
const state = reactive({
  obj: defaultObj
})
</script>

<template>
  <Layout>
    <Form v-slot="$form" :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <Fieldset
        legend="Phone data"
        class="m-6 gap-6 flex flex-col"
        pt:content:class="flex gap-2 flex flex-col"
      >
        <Fieldset
          legend="Phone basic information"
          class="m-6 gap-6 flex flex-col"
          pt:content:class="flex gap-2 flex flex-col"
        >
          <InputTextField
            fieldName="countryDialingCode"
            v-model="state.obj.countryDialingCode"
            helpText="With leading plus sign, for example +1 for the USA, +49 for Germany."
            labelText="Country dialing code"
          />

          <InputTextField
            fieldName="phoneNumber"
            v-model="state.obj.phoneNumber"
            helpText="Phone number without any spaces or other special characters"
            labelText="Phone number"
          />
          <CheckboxField
            fieldName="canReceiveSMS"
            v-model="state.obj.canReceiveSMS"
            helpText="Is this phone number able to receive the SMS messages? Land lines or faxes cannot receive SMS messages, mobile phones usually can."
            labelText="Is mobile - can receive SMS"
          />
        </Fieldset>

        <Button type="submit" severity="primary" label="Save phone" />
        <Button severity="secondary" label="Close without saving" @click="goBack" />
      </Fieldset>
    </Form>
  </Layout>
</template>
