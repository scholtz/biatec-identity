<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import Layout from '@/layouts/PublicLayout.vue'
import { useToast } from 'primevue/usetoast'
import { Form } from '@primevue/forms'

import { useAppStore } from '@/stores/app'
import { v7 as uuidv7 } from 'uuid'
import { useRoute, useRouter } from 'vue-router'
import type { IPerson } from '@/interface/IPerson'
import EnumSelectField from '@/components/form/EnumSelectField.vue'
import InputTextField from '@/components/form/InputTextField.vue'

import { personFormatter } from '@/scripts/formatters/personFormatter'
import { companyFormatter } from '@/scripts/formatters/companyFormatter'

import type { ICompanyPeople } from '@/interface/ICompanyPeople'
import { enumFormatter } from '@/scripts/formatters/enumFormatter'

const store = useAppStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  var id = route.params['id'] as string
  if (id) {
    if (store.state.userInput.people[id]) {
      state.objType = store.state.userInput.people[id]
      state.obj.personId = id
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
    if (!store.state.userInput.companyPeople) store.state.userInput.companyPeople = {}
    store.state.userInput.companyPeople[id] = state.obj
    toast.add({ severity: 'success', summary: 'Form has been submitted', life: 3000 })
  } else {
    toast.add({ severity: 'error', summary: 'The form contains the error', life: 3000 })
  }
}

const goBack = () => {
  router.push('/user-input-overview')
}

const defaultObjType: IPerson = {
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
const defaultObj: ICompanyPeople = {
  type: undefined,
  companyId: '',
  personId: '',
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
        legend="Assign person to the company"
        class="m-6 gap-6 flex flex-col"
        pt:content:class="flex gap-2 flex flex-col"
      >
        <Fieldset
          v-if="state.objType"
          :legend="personFormatter(state.objType)"
          class="m-6 gap-6 flex flex-col"
          pt:content:class="flex gap-2 flex flex-col"
        >
          <Fieldset
            v-if="state.objType"
            legend="Current relations"
            class="m-6 gap-6 flex flex-col"
            pt:content:class="flex gap-2 flex flex-col"
          >
            <div
              v-for="(companyPerson, id) in store.state.userInput.companyPeople"
              v-if="store.state.userInput.companyPeople"
            >
              <div v-if="companyPerson.personId == state.obj.personId">
                <span>
                  {{ companyFormatter(store.state.userInput.companies[companyPerson.companyId]) }} -
                  {{ enumFormatter('COMPANY_RELATION_TYPE', companyPerson.type) }} -
                  {{ companyPerson.note ? companyPerson.note : 'No comment' }}
                </span>
                <Button
                  severity="secondary"
                  @click="delete store.state.userInput.companyPeople[id]"
                  class="m-2"
                >
                  X
                </Button>
              </div>
            </div>
          </Fieldset>

          <EnumSelectField
            fieldName="type"
            v-model="state.obj.type"
            helpText="Select the best relation type."
            labelText="Person's relation"
            enum="COMPANY_RELATION_TYPE"
          />

          <EnumSelectField
            fieldName="companyId"
            v-model="state.obj.companyId"
            helpText="Select company which is related to the person."
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
            Object.values(store.state.userInput.companyPeople ?? []).filter(
              (pa) => pa.personId == state.obj.personId
            ).length == 0
              ? 'primary'
              : 'secondary'
          "
          label="Save relation"
        />
        <Button
          :severity="
            state.obj.personId &&
            Object.values(store.state.userInput.companyPeople ?? []).filter(
              (pa) => pa.personId == state.obj.personId
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
