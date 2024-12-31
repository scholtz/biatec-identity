<script setup lang="ts">
import { ref, reactive, onMounted, toValue } from 'vue'
import Layout from '@/layouts/PublicLayout.vue'
import { useToast } from 'primevue/usetoast'
import { Form } from '@primevue/forms'

import { useAppStore } from '@/stores/app'
import { v7 as uuidv7 } from 'uuid'
import { useRoute, useRouter } from 'vue-router'
import type { IAddress } from '@/interface/IAddress'
import InputTextField from '@/components/form/InputTextField.vue'
import CountrySelectField from '@/components/form/CountrySelectField.vue'
const store = useAppStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  var id = route.params['id'] as string
  if (id) {
    if (store.state.userInput.addresses[id]) {
      state.obj = { ...store.state.userInput.addresses[id] }
    }
  }
})

const resolver = () => {
  const errors: any = {}

  if (!state.obj.street) {
    errors.street = [{ message: 'Street is required.' }]
  }
  if (!state.obj.city) {
    errors.city = [{ message: 'City is required.' }]
  }
  if (!state.obj.countryCode) {
    errors.countryCode = [{ message: 'Country is required.' }]
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
    store.state.userInput.addresses[id] = state.obj
    toast.add({ severity: 'success', summary: 'Form has been submitted', life: 3000 })
    router.push('/user-input-overview')
  } else {
    toast.add({ severity: 'error', summary: 'The form contains the error', life: 3000 })
  }
}

const goBack = () => {
  router.push('/user-input-overview')
}

const defaultObj: IAddress = {
  street: '',
  streetNumber: '',
  streetLine2: '',
  city: '',
  zipCode: '',
  countryCode: ''
}
const state = reactive({
  obj: defaultObj
})
</script>

<template>
  <Layout>
    <Form v-slot="$form" :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <Fieldset
        legend="Address data"
        class="m-6 gap-6 flex flex-col"
        pt:content:class="flex gap-2 flex flex-col"
      >
        <Fieldset
          legend="Location"
          class="m-6 gap-6 flex flex-col"
          pt:content:class="flex gap-2 flex flex-col"
        >
          <InputTextField
            fieldName="street"
            v-model="state.obj.street"
            helpText="Street without the number"
            labelText="Street"
          ></InputTextField>

          <InputTextField
            fieldName="streetNumber"
            v-model="state.obj.streetNumber"
            helpText="Street number."
            labelText="Street number"
          ></InputTextField>

          <InputTextField
            fieldName="streetLine2"
            v-model="state.obj.streetLine2"
            helpText="Second line for better address specification."
            labelText="Street line 2"
          ></InputTextField>

          <InputTextField
            fieldName="city"
            v-model="state.obj.city"
            helpText="City in which address is located."
            labelText="City"
          ></InputTextField>

          <InputTextField
            fieldName="zipCode"
            v-model="state.obj.zipCode"
            helpText="ZIP Code of the city."
            labelText="ZIP Code"
          ></InputTextField>

          <CountrySelectField
            fieldName="countryCode"
            v-model="state.obj.countryCode"
            helpText="In which country is the address located?"
            labelText="Country"
          ></CountrySelectField>
        </Fieldset>

        <Button type="submit" severity="primary" label="Save address" />
        <Button severity="secondary" label="Close without saving" @click="goBack" />
      </Fieldset>
    </Form>
  </Layout>
</template>
