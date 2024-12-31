<script setup lang="ts">
import { FormField } from '@primevue/forms'
import { defineProps, defineEmits, ref, watch } from 'vue'

const model = defineModel<Date>()

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
    <FloatLabel variant="on" :title="props.helpText">
      <InputGroup>
        <DatePicker class="w-full" v-model="model" />
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
