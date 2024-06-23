<script setup lang="ts">
import Card from 'primevue/card'
import { ref, onMounted, onBeforeUnmount } from 'vue'
const isMobile = ref(false)

function handleResize() {
  if (window.innerWidth <= 768) {
    isMobile.value = true
  } else {
    isMobile.value = false
  }
}

onMounted(() => {
  if (window.innerWidth <= 768) {
    isMobile.value = true
  }
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
<template>
  <Card class="m-2 text-center">
    <template #content>
      Biatec Identity is part of the Biatec Group -
      <a href="https://www.biatec.io">https://www.biatec.io</a>
    </template>
  </Card>
</template>
