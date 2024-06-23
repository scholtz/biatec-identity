<script setup lang="ts">
import Layout from '@/layouts/PublicLayout.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'

/* eslint-disable no-useless-escape */
</script>
<template>
  <Layout :hideTopMenu="false">
    <div>
      <div class="m-2 md:m-6">
        <Card class="col-12 md:col-offset-3 md:col-6 my-4">
          <template #content>
            <h1>Join the biatec identity waiting list</h1>
            <p>First to join will have priority in usage of our services:</p>
            <ul>
              <li>up to 2x lower liqudity pool fees when trading at the Biatec DEX</li>
              <li>biatec engagement level increased</li>
              <li>
                identity verification will be processed on FIFO bases, sooner you enter the waiting
                list, sooner you will receive benefits
              </li>
            </ul>
            <a href="https://forms.gle/XSXgjwLHuF5CL8Kd8">
              <Button>Join waiting list</Button>
            </a>
          </template>
        </Card>
      </div>
    </div>
  </Layout>
</template>
<style>
.svg-image {
  height: 8em;
}
</style>
