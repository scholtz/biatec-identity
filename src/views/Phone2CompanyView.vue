<script setup lang="ts">
import { ref, reactive, onMounted, toValue } from 'vue'
import Layout from '@/layouts/PublicLayout.vue'
import { useToast } from 'primevue/usetoast'
import { Form } from '@primevue/forms'

import { useAppStore } from '@/stores/app'
import { v7 as uuidv7 } from 'uuid'
import { useRoute, useRouter } from 'vue-router'
import type { IPhone } from '@/interface/IPhone'
import EnumSelectField from '@/components/form/EnumSelectField.vue'
import InputTextField from '@/components/form/InputTextField.vue'

import { phoneFormatter } from '@/scripts/formatters/phoneFormatter'
import { companyFormatter } from '@/scripts/formatters/companyFormatter'
import { enumFormatter } from '@/scripts/formatters/enumFormatter'
import type { ICompanyPhone } from '@/interface/ICompanyPhone'
const store = useAppStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  var id = route.params['id'] as string
  if (id) {
    if (store.state.userInput.phones[id]) {
      state.objType = store.state.userInput.phones[id]
      state.obj.phoneId = id
    }
  }
  console.log('onMounted', id, store.state.userInput, state.obj)
})

const resolver = () => {
  const errors: any = {}

  if (!state.obj.companyId) {
    errors.companyId = [{ message: 'Company selection is required.' }]
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
    if (!store.state.userInput.companyPhones) store.state.userInput.companyPhones = {}
    store.state.userInput.companyPhones[id] = state.obj
    toast.add({ severity: 'success', summary: 'Form has been submitted', life: 3000 })
  } else {
    toast.add({ severity: 'error', summary: 'The form contains the error', life: 3000 })
  }
}

const goBack = () => {
  router.push('/user-input-overview')
}

const defaultObjType: IPhone = {
  countryDialingCode: '',
  phoneNumber: '',
  canReceiveSMS: false
}
const defaultObj: ICompanyPhone = {
  companyId: '',
  phoneId: '',
  note: ''
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
        legend="Assign phone to the company"
        class="m-6 gap-6 flex flex-col"
        pt:content:class="flex gap-2 flex flex-col"
      >
        <Fieldset
          v-if="state.objType"
          :legend="phoneFormatter(state.objType)"
          class="m-6 gap-6 flex flex-col"
          pt:content:class="flex gap-2 flex flex-col"
        >
          <Fieldset
            v-if="state.objType"
            legend="Current relations"
            class="m-6 gap-6 flex flex-col"
            pt:content:class="flex gap-2 flex flex-col"
          >
            <div v-for="(companyPhone, id) in store.state.userInput.companyPhones">
              <div v-if="companyPhone.phoneId == state.obj.phoneId">
                <span>
                  {{ companyFormatter(store.state.userInput.companies[companyPhone.companyId]) }} -
                  {{ companyPhone.note ? companyPhone.note : 'No comment' }}
                </span>
                <Button
                  severity="secondary"
                  @click="delete store.state.userInput.companyPhones[id]"
                  class="m-2"
                >
                  X
                </Button>
              </div>
            </div>
          </Fieldset>
          <EnumSelectField
            fieldName="companyId"
            v-model="state.obj.companyId"
            helpText="Select company who is related to the phone."
            labelText="Company"
            enum="COMPANY"
          />

          <InputTextField
            fieldName="note"
            v-model="state.obj.note"
            helpText="Please write any comment to explain the relation."
            labelText="Comment"
          ></InputTextField>
        </Fieldset>

        <Button
          type="submit"
          :severity="
            Object.values(store.state.userInput.companyPhones).filter(
              (pa) => pa.phoneId == state.obj.phoneId
            ).length == 0
              ? 'primary'
              : 'secondary'
          "
          label="Save relation"
        />
        <Button
          :severity="
            state.obj.phoneId &&
            Object.values(store.state.userInput.companyPhones).filter(
              (pa) => pa.phoneId == state.obj.phoneId
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
