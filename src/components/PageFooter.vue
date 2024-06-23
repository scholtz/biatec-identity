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
      <div>
        Biatec Identity is part of the Biatec Group -
        <a href="https://www.biatec.io">https://www.biatec.io</a>
      </div>
      <div>
        Join our discord channel to show us support or if you need any help -
        <a href="https://discord.gg/Tkne4cfvkA" target="_blank">Biatec Discord</a>.
      </div>
    </template>
  </Card>
</template>
