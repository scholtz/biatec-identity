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
import { personFormatter } from '@/scripts/formatters/personFormatter'
import { enumFormatter } from '@/scripts/formatters/enumFormatter'
import type { IPersonXAccount } from '@/interface/IPersonXAccount'
const store = useAppStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  var id = route.params['id'] as string
  if (id) {
    if (store.state.userInput.xAccounts[id]) {
      state.objType = store.state.userInput.xAccounts[id]
      state.obj.xAccountId = id
    }
  }
  console.log('onMounted', id, store.state.userInput, state.obj)
})

const resolver = () => {
  const errors: any = {}

  if (!state.obj.personId) {
    errors.personId = [{ message: 'Person selection is required.' }]
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
    if (!store.state.userInput.personXAccounts) store.state.userInput.personXAccounts = {}
    store.state.userInput.personXAccounts[id] = state.obj
    toast.add({ severity: 'success', summary: 'Form has been submitted', life: 3000 })
  } else {
    toast.add({ severity: 'error', summary: 'The form contains the error', life: 3000 })
  }
}

const goBack = () => {
  router.push('/user-input-overview')
}

const defaultObjType: IXAccount = {
  xAccount: ''
}
const defaultObj: IPersonXAccount = {
  personId: '',
  xAccountId: '',
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
        legend="Assign xAccount to the person"
        class="m-6 gap-6 flex flex-col"
        pt:content:class="flex gap-2 flex flex-col"
      >
        <Fieldset
          v-if="state.objType"
          :legend="xAccountFormatter(state.objType)"
          class="m-6 gap-6 flex flex-col"
          pt:content:class="flex gap-2 flex flex-col"
        >
          <Fieldset
            v-if="state.objType"
            legend="Current relations"
            class="m-6 gap-6 flex flex-col"
            pt:content:class="flex gap-2 flex flex-col"
          >
            <div v-for="(personXAccount, id) in store.state.userInput.personXAccounts">
              <div v-if="personXAccount.xAccountId == state.obj.xAccountId">
                <span>
                  {{ personFormatter(store.state.userInput.people[personXAccount.personId]) }} -
                  {{ personXAccount.note ? personXAccount.note : 'No comment' }}
                </span>
                <Button
                  severity="secondary"
                  @click="delete store.state.userInput.personXAccounts[id]"
                  class="m-2"
                >
                  X
                </Button>
              </div>
            </div>
          </Fieldset>
          <EnumSelectField
            fieldName="personId"
            v-model="state.obj.personId"
            helpText="Select person who is related to the xAccount."
            labelText="Person"
            enum="PERSON"
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
            Object.values(store.state.userInput.personXAccounts).filter(
              (pa) => pa.xAccountId == state.obj.xAccountId
            ).length == 0
              ? 'primary'
              : 'secondary'
          "
          label="Save relation"
        />
        <Button
          :severity="
            state.obj.xAccountId &&
            Object.values(store.state.userInput.personXAccounts).filter(
              (pa) => pa.xAccountId == state.obj.xAccountId
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
