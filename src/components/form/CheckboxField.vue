<script setup lang="ts">
import { FormField } from '@primevue/forms'
import { defineProps, defineEmits, ref, watch } from 'vue'

const model = defineModel<boolean>()

// Define props and emits
const props = defineProps<{
  fieldName: string
  helpText: string
  labelText: string
}>()
</script>

<template>
  <FormField v-slot="$field" :name="props.fieldName" class="flex flex-col gap-4">
    <Message v-if="$field?.props?.help" severity="info" size="small">
      {{ props.helpText }}
    </Message>
    <InputGroup :title="props.helpText">
      <Checkbox binary :inputId="props.fieldName" v-model="model" />
      <label :for="props.fieldName" class="ml-2 w-full">{{ props.labelText }}</label>
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

    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
      {{ $field.error?.message }}
    </Message>
  </FormField>
</template>
