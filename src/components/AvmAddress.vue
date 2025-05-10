<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const props = defineProps<{
  address: string
}>()

function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text).then(
    function () {
      console.log('Async: Copying to clipboard was successful!')
      toast.add({
        detail: 'Address copied to clipboard',
        severity: 'info',
        closable: true,
        life: 5000
      })
    },
    function (err) {
      console.error('Async: Could not copy text: ', err)
      toast.add({
        detail: 'Error occured while copying to clipboard',
        severity: 'error',
        closable: true,
        life: 10000
      })
    }
  )
}
</script>
<template>
  <abbr
    v-if="props.address?.length > 4"
    :title="props.address"
    @click="copyTextToClipboard(props.address)"
  >
    {{ props.address.substring(0, 5) }}..{{ props.address.substring(props.address.length - 5) }}
  </abbr>
  <span v-else>{{ props.address }}</span>
</template>
