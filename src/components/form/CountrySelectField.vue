<script setup lang="ts">
import { CountryService } from '@/service/CountryService'
import { FormField } from '@primevue/forms'
import { defineProps, defineEmits, ref, watch, onMounted } from 'vue'

const model = defineModel<string>()

// Define props and emits
const props = defineProps<{
  fieldName: string
  helpText: string
  labelText: string
}>()

const countries = ref()
onMounted(() => {
  CountryService.getCountries().then((data) => (countries.value = data))
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
          v-if="countries"
          v-model="model"
          :options="countries"
          filter
          optionLabel="name"
          optionValue="code"
          class="w-full"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center">
              <img
                :alt="slotProps.value"
                src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                :class="`mr-2 flag flag-${slotProps.value.toLowerCase()}`"
                style="width: 18px"
              />
              <div>{{ countries.find((c) => c.code == slotProps.value).name }}</div>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex items-center">
              <img
                :alt="slotProps.option.label"
                src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`"
                style="width: 18px"
              />
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
