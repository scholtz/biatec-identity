// import './assets/auth.css'
// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'
import ConfirmationService from 'primevue/confirmationservice'
import Ripple from 'primevue/ripple'
import QrcodeReaderVue3 from 'qrcode-reader-vue3'
import StyleClass from 'primevue/styleclass'

import AppState from './stores/appState'
import Aura from '@primevue/themes/aura'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import VueFilesPreview from 'vue-files-preview'

import Noir from './presets/Noir'
import './style.css'
import '@/assets/flags.css'
import './assets/auth.css'
import 'primeicons/primeicons.css'
const app = createApp(App)
app.use(createPinia())

app.use(PrimeVue, {
  theme: {
    preset: Noir,
    options: {
      prefix: 'p',
      darkModeSelector: '.p-dark',
      cssLayer: false
    }
  }
})

app.use(AppState)
app.use(ConfirmationService)
app.use(ToastService)
app.use(DialogService)
app.use(router)
app.use(QrcodeReaderVue3)
app.use(VueFilesPreview)

app.component('ThemeSwitcher', ThemeSwitcher)

app.directive('ripple', Ripple)
app.directive('styleclass', StyleClass)

app.mount('#app')
