<script setup lang="ts">
import { ref, reactive, onMounted, toValue } from 'vue'
import Layout from '@/layouts/PublicLayout.vue'
import { useToast } from 'primevue/usetoast'
import { Form } from '@primevue/forms'

import { useAppStore } from '@/stores/app'
import { v7 as uuidv7 } from 'uuid'
import { useRoute, useRouter } from 'vue-router'
import type { IDiscord } from '@/interface/IDiscord'
import EnumSelectField from '@/components/form/EnumSelectField.vue'
import InputTextField from '@/components/form/InputTextField.vue'

import { discordFormatter } from '@/scripts/formatters/discordFormatter'
import { companyFormatter } from '@/scripts/formatters/companyFormatter'
import { enumFormatter } from '@/scripts/formatters/enumFormatter'
import type { ICompanyDiscord } from '@/interface/ICompanyDiscord'
const store = useAppStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  var id = route.params['id'] as string
  if (id) {
    if (store.state.userInput.discordAccounts[id]) {
      state.objType = store.state.userInput.discordAccounts[id]
      state.obj.discordId = id
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
    if (!store.state.userInput.companyDiscordAccounts)
      store.state.userInput.companyDiscordAccounts = {}
    store.state.userInput.companyDiscordAccounts[id] = state.obj
    toast.add({ severity: 'success', summary: 'Form has been submitted', life: 3000 })
  } else {
    toast.add({ severity: 'error', summary: 'The form contains the error', life: 3000 })
  }
}

const goBack = () => {
  router.push('/user-input-overview')
}

const defaultObjType: IDiscord = {
  discordName: ''
}
const defaultObj: ICompanyDiscord = {
  companyId: '',
  discordId: '',
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
        legend="Assign discord to the company"
        class="m-6 gap-6 flex flex-col"
        pt:content:class="flex gap-2 flex flex-col"
      >
        <Fieldset
          v-if="state.objType"
          :legend="discordFormatter(state.objType)"
          class="m-6 gap-6 flex flex-col"
          pt:content:class="flex gap-2 flex flex-col"
        >
          <Fieldset
            v-if="state.objType"
            legend="Current relations"
            class="m-6 gap-6 flex flex-col"
            pt:content:class="flex gap-2 flex flex-col"
          >
            <div v-for="(companyDiscord, id) in store.state.userInput.companyDiscordAccounts">
              <div v-if="companyDiscord.discordId == state.obj.discordId">
                <span>
                  {{ companyFormatter(store.state.userInput.companies[companyDiscord.companyId]) }}
                  -
                  {{ companyDiscord.note ? companyDiscord.note : 'No comment' }}
                </span>
                <Button
                  severity="secondary"
                  @click="delete store.state.userInput.companyDiscordAccounts[id]"
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
            helpText="Select company who is related to the discord."
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
            Object.values(store.state.userInput.companyDiscordAccounts).filter(
              (pa) => pa.discordId == state.obj.discordId
            ).length == 0
              ? 'primary'
              : 'secondary'
          "
          label="Save relation"
        />
        <Button
          :severity="
            state.obj.discordId &&
            Object.values(store.state.userInput.companyDiscordAccounts).filter(
              (pa) => pa.discordId == state.obj.discordId
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
