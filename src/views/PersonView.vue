<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import Layout from '@/layouts/PublicLayout.vue'
import { useToast } from 'primevue/usetoast'
import { Form } from '@primevue/forms'
import { FormField } from '@primevue/forms'

import { useAppStore } from '@/stores/app'
import type { IPerson } from '@/interface/IPerson'
import { v7 as uuidv7 } from 'uuid'
import { useRoute, useRouter } from 'vue-router'
import InputTextField from '@/components/form/InputTextField.vue'
import CountrySelectField from '@/components/form/CountrySelectField.vue'
import CheckboxField from '@/components/form/CheckboxField.vue'
import DateField from '@/components/form/DateField.vue'
import { personFormatter } from '@/scripts/formatters/personFormatter'
const store = useAppStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  var id = route.params['id'] as string
  if (id) {
    if (store.state.userInput.people[id]) {
      state.obj = { ...store.state.userInput.people[id] }
    }
  }
})

const resolver = () => {
  const errors: any = {}

  if (!state.obj.firstName) {
    errors.firstName = [{ message: 'First name is required.' }]
  }
  if (!state.obj.lastName) {
    errors.lastName = [{ message: 'Last name is required.' }]
  }

  return {
    errors
  }
}
const onFormSubmit = ({ valid }) => {
  console.log('onFormSubmit', valid, state.obj, store.state.userInput)
  if (valid) {
    let id = route.params['id'] as string
    if (!id) id = uuidv7()
    store.state.userInput.people[id] = state.obj
    toast.add({ severity: 'success', summary: 'Form has been submitted', life: 3000 })
    router.push('/user-input-overview')
  } else {
    toast.add({ severity: 'error', summary: 'The form contains the error', life: 3000 })
  }
}

const goBack = () => {
  router.push('/user-input-overview')
}

const defaultObj: IPerson = {
  titleBefore: '',
  firstName: '',
  middleName: '',
  lastName: '',
  titleAfter: '',
  birthDate: undefined,
  birthPlace: '',
  birthCountry: '',
  residencyCountry: '',
  taxCountry: '',
  govId: '',
  isPEP: false
}
const state = reactive({
  obj: defaultObj
})
</script>

<template>
  <Layout>
    <Form v-slot="$form" :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <Fieldset
        legend="Person data"
        class="m-6 gap-6 flex flex-col"
        pt:content:class="flex gap-2 flex flex-col"
      >
        <Fieldset
          legend="Name"
          class="m-6 gap-6 flex flex-col"
          pt:content:class="flex gap-2 flex flex-col"
        >
          <InputTextField
            fieldName="titleBefore"
            v-model="state.obj.titleBefore"
            helpText="For example Ing., Prof., MBA, BBA, or other titles received at university. Keep empty if you do not provide the document stating your title."
            labelText="Title before name"
          />

          <InputTextField
            fieldName="firstName"
            v-model="state.obj.firstName"
            helpText="Person's first name as is written in the official document. Please use the special chars if applied in your alphabet."
            labelText="First name"
          />
          <InputTextField
            fieldName="middleName"
            v-model="state.obj.middleName"
            helpText="Person's middle name as is written in the official document. Please use the special chars if applied in your alphabet."
            labelText="Middle name"
          />
          <InputTextField
            fieldName="lastName"
            v-model="state.obj.lastName"
            helpText="Person's last name (family name) as is written in the official document. Please use the special chars if applied in your alphabet.."
            labelText="Last name"
          />

          <InputTextField
            fieldName="titleAfter"
            v-model="state.obj.titleAfter"
            helpText="For example PhD or other titles received at university. Keep empty if you do not provide the document stating your title."
            labelText="Title after name"
          />
        </Fieldset>

        <Fieldset
          legend="Birth information"
          class="m-6 gap-6 flex flex-col"
          pt:content:class="flex gap-2 flex flex-col"
        >
          <DateField
            fieldName="birthDate"
            v-model="state.obj.birthDate"
            helpText="Date of birth."
            labelText="Date of birth"
          />
          <InputTextField
            fieldName="birthPlace"
            v-model="state.obj.birthPlace"
            :helpText="`In which city was ${personFormatter(state.obj)} born?`"
            labelText="Place of birth"
          />
          <CountrySelectField
            fieldName="birthCountry"
            v-model="state.obj.birthCountry"
            :helpText="`In which country was ${personFormatter(state.obj)} born?`"
            labelText="Country of birth"
          />
        </Fieldset>

        <Fieldset
          legend="Government identification"
          class="m-6 gap-6 flex flex-col"
          pt:content:class="flex gap-2 flex flex-col"
        >
          <CountrySelectField
            fieldName="residencyCountry"
            v-model="state.obj.residencyCountry"
            :helpText="`Which country has issued ${personFormatter(state.obj)} id card or passport?`"
            labelText="Country of pernament residency"
          />

          <CountrySelectField
            fieldName="taxCountry"
            v-model="state.obj.taxCountry"
            :helpText="`In which country is ${personFormatter(state.obj)} registered to pay the taxes?`"
            labelText="Tax domicil country"
          />

          <InputTextField
            fieldName="govId"
            v-model="state.obj.govId"
            :helpText="`Please write here your government id as is stated on your id card. It is either the SSN, birth number or unique government id.`"
            labelText="Personal ID issued by government"
          />
          <CheckboxField
            fieldName="isPEP"
            v-model="state.obj.isPEP"
            helpText="A Politically Exposed Person (PEP) is an individual who holds or has held a prominent public position, or is closely associated with such individuals, posing a higher risk for potential involvement in corruption or financial misconduct."
            labelText="Politically Exposed Person"
          />
        </Fieldset>

        <Button type="submit" severity="primary" label="Save person" />
        <Button severity="secondary" label="Close without saving" @click="goBack" />
      </Fieldset>
    </Form>
  </Layout>
</template>
