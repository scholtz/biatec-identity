<script setup lang="ts">
import { companyFormatter } from '@/scripts/formatters/companyFormatter'
import { documentFormatter } from '@/scripts/formatters/documentFormatter'
import { personFormatter } from '@/scripts/formatters/personFormatter'
import { CompanyAddressTypeService } from '@/service/CompanyAddressTypeService'
import { CompanyRelationTypeService } from '@/service/CompanyRelationTypeService'
import { DocumentTypeService } from '@/service/DocumentTypeService'
import { FileTypeService } from '@/service/FileTypeService'
import { PersonAddressTypeService } from '@/service/PersonAddressTypeService'
import { ProofTypeService } from '@/service/ProofTypeService'
import { useAppStore } from '@/stores/app'
import { FormField } from '@primevue/forms'
import { defineProps, defineEmits, ref, watch, onMounted } from 'vue'
const store = useAppStore()
const model = defineModel<string>()

// Define props and emits
const props = defineProps<{
  enum:
    | 'DOCUMENT_TYPE'
    | 'PERSON_ADDRESS_TYPE'
    | 'COMPANY_ADDRESS_TYPE'
    | 'PERSON'
    | 'COMPANY'
    | 'FILE_TYPE'
    | 'DOCUMENT'
    | 'COMPANY_RELATION_TYPE'
    | 'PROOF_TYPE'
  fieldName: string
  helpText: string
  labelText: string
}>()

const enumData = ref()
onMounted(() => {
  if (props.enum == 'DOCUMENT_TYPE') {
    enumData.value = DocumentTypeService.getData()
  }
  if (props.enum == 'FILE_TYPE') {
    enumData.value = FileTypeService.getData()
  }
  if (props.enum == 'PERSON_ADDRESS_TYPE') {
    enumData.value = PersonAddressTypeService.getData()
  }
  if (props.enum == 'COMPANY_ADDRESS_TYPE') {
    enumData.value = CompanyAddressTypeService.getData()
  }
  if (props.enum == 'COMPANY_RELATION_TYPE') {
    enumData.value = CompanyRelationTypeService.getData()
  }
  if (props.enum == 'PROOF_TYPE') {
    enumData.value = ProofTypeService.getData()
  }
  if (props.enum == 'PERSON') {
    enumData.value = Object.keys(store.state.userInput.people).map((id) => {
      return { name: personFormatter(store.state.userInput.people[id]), code: id }
    })
  }
  if (props.enum == 'COMPANY') {
    enumData.value = Object.keys(store.state.userInput.companies).map((id) => {
      return { name: companyFormatter(store.state.userInput.companies[id]), code: id }
    })
  }
  if (props.enum == 'DOCUMENT') {
    enumData.value = Object.keys(store.state.userInput.documents).map((id) => {
      return { name: documentFormatter(store.state.userInput.documents[id]), code: id }
    })
  }
})
</script>

<template>
  <FormField v-slot="$field" name="countryCode" class="flex flex-col gap-4">
    <Message v-if="$field?.props?.help" severity="info" size="small">
      {{ props.helpText }}
    </Message>
    <FloatLabel variant="on" :title="props.helpText">
      <InputGroup>
        <Select
          v-if="enumData"
          v-model="model"
          :options="enumData"
          filter
          optionLabel="name"
          optionValue="code"
          class="w-full"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center">
              <div>{{ enumData.find((c) => c.code == slotProps.value).name }}</div>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex items-center">
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
        </Select>
        <label>{{ props.labelText }}</label>
        <InputGroupAddon>
          <Button
            icon="pi pi-search"
            severity="secondary"
            variant="text"
            @click="$field.props.help = !$field.props.help"
          >
            ?
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </FloatLabel>

    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
      {{ $field.error?.message }}
    </Message>
  </FormField>
</template>
