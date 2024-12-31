<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Layout from '@/layouts/PublicLayout.vue'
import { useToast } from 'primevue/usetoast'
import { Form } from '@primevue/forms'

import { useAppStore } from '@/stores/app'
import { v7 as uuidv7 } from 'uuid'
import { useRoute, useRouter } from 'vue-router'
import type { ICompany } from '@/interface/ICompany'
import InputTextField from '@/components/form/InputTextField.vue'
import CountrySelectField from '@/components/form/CountrySelectField.vue'
import DateField from '@/components/form/DateField.vue'

const store = useAppStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  var id = route.params['id'] as string
  if (id) {
    if (store.state.userInput.companies[id]) {
      state.obj = { ...store.state.userInput.companies[id] }
    }
  }
})

const resolver = () => {
  const errors: any = {}

  if (!state.obj.name) {
    errors.name = [
      { message: 'Company name as is registered in the trade registry must be provided.' }
    ]
  }
  if (!state.obj.registrationNumber) {
    errors.registrationNumber = [{ message: 'Registration number is required.' }]
  }
  if (!state.obj.taxIdentificationNumber) {
    errors.taxIdentificationNumber = [{ message: 'Tax identification number is required.' }]
  }
  if (!state.obj.incorporationCountry) {
    errors.incorporationCountry = [{ message: 'Country is required.' }]
  }
  if (!state.obj.incorporationDate) {
    errors.incorporationDate = [{ message: 'Company registration date is required.' }]
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
    store.state.userInput.companies[id] = state.obj
    toast.add({ severity: 'success', summary: 'Form has been submitted', life: 3000 })
    router.push('/user-input-overview')
  } else {
    toast.add({ severity: 'error', summary: 'The form contains the error', life: 3000 })
  }
}

const goBack = () => {
  router.push('/user-input-overview')
}

const defaultObj: ICompany = {
  name: '',
  registrationNumber: '',
  taxIdentificationNumber: '',
  incorporationDate: undefined,
  incorporationCountry: ''
}
const state = reactive({
  obj: defaultObj
})
</script>

<template>
  <Layout>
    <Form v-slot="$form" :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <Fieldset
        legend="Company data"
        class="m-6 gap-6 flex flex-col"
        pt:content:class="flex gap-2 flex flex-col"
      >
        <Fieldset
          legend="Current information"
          class="m-6 gap-6 flex flex-col"
          pt:content:class="flex gap-2 flex flex-col"
        >
          <InputTextField
            fieldName="name"
            v-model="state.obj.name"
            helpText="Company name as is registered in the trade registry."
            labelText="Company name"
          />

          <InputTextField
            fieldName="registrationNumber"
            v-model="state.obj.registrationNumber"
            helpText="Registration number issued by the trade registry."
            labelText="Registration number"
          />

          <InputTextField
            fieldName="taxIdentificationNumber"
            v-model="state.obj.taxIdentificationNumber"
            helpText="Tax identification number issued by the tax office."
            labelText="Tax identification number"
          />
        </Fieldset>

        <Fieldset
          legend="Incorporation"
          class="m-6 gap-6 flex flex-col"
          pt:content:class="flex gap-2 flex flex-col"
        >
          <DateField
            fieldName="incorporationDate"
            v-model="state.obj.incorporationDate"
            helpText="Incorporation date - the date from when is the company registered"
            labelText="Incorporation date"
          />

          <CountrySelectField
            fieldName="incorporationCountry"
            v-model="state.obj.incorporationCountry"
            helpText="Country where the company is registered"
            labelText="Incorporation country"
          />
        </Fieldset>

        <Button type="submit" severity="primary" label="Save the company" />
        <Button severity="secondary" label="Close without saving" @click="goBack" />
      </Fieldset>
    </Form>
  </Layout>
</template>
