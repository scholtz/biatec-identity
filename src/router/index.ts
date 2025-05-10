import { createRouter, createWebHistory } from 'vue-router'
import PublicHomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta?.env?.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ left: 0, top: 0 })
      }, 1)
    })
  },

  routes: [
    {
      path: '/',
      name: 'home',
      component: PublicHomeView
    },
    {
      path: '/user-input-overview',
      name: 'user-input-overview',
      component: () => import('@/views/UserInputOverview.vue')
    },
    {
      path: '/person',
      name: 'person',
      component: () => import('@/views/PersonView.vue')
    },
    {
      path: '/person/:id',
      name: 'person-id',
      component: () => import('@/views/PersonView.vue')
    },
    {
      path: '/address',
      name: 'address',
      component: () => import('@/views/AddressView.vue')
    },
    {
      path: '/address/:id',
      name: 'address-id',
      component: () => import('@/views/AddressView.vue')
    },
    {
      path: '/assign-to-person/address/:id',
      name: 'assign-to-person-address-id',
      component: () => import('@/views/Address2PersonView.vue')
    },
    {
      path: '/assign-to-company/address/:id',
      name: 'assign-to-company-address-id',
      component: () => import('@/views/Address2CompanyView.vue')
    },
    {
      path: '/company/',
      name: 'company',
      component: () => import('@/views/CompanyView.vue')
    },
    {
      path: '/company/:id',
      name: 'company-id',
      component: () => import('@/views/CompanyView.vue')
    },
    {
      path: '/assign-to-company/person/:id',
      name: 'assign-to-company-person-id',
      component: () => import('@/views/Person2CompanyView.vue')
    },
    {
      path: '/discord/',
      name: 'discord',
      component: () => import('@/views/DiscordView.vue')
    },
    {
      path: '/discord/:id',
      name: 'discord-id',
      component: () => import('@/views/DiscordView.vue')
    },
    {
      path: '/assign-to-person/discord/:id',
      name: 'assign-to-person-discord-id',
      component: () => import('@/views/Discord2PersonView.vue')
    },
    {
      path: '/assign-to-company/discord/:id',
      name: 'assign-to-company-discord-id',
      component: () => import('@/views/Discord2CompanyView.vue')
    },
    {
      path: '/document/',
      name: 'document',
      component: () => import('@/views/DocumentView.vue')
    },
    {
      path: '/document/:id',
      name: 'document-id',
      component: () => import('@/views/DocumentView.vue')
    },
    {
      path: '/file/',
      name: 'file',
      component: () => import('@/views/FileView.vue')
    },
    {
      path: '/file/:id',
      name: 'file-id',
      component: () => import('@/views/FileView.vue')
    },
    {
      path: '/assign-to-document/file/:id',
      name: 'assign-to-document-file-id',
      component: () => import('@/views/File2DocumentView.vue')
    },
    {
      path: '/phone/',
      name: 'phone',
      component: () => import('@/views/PhoneView.vue')
    },
    {
      path: '/phone/:id',
      name: 'phone-id',
      component: () => import('@/views/PhoneView.vue')
    },
    {
      path: '/assign-to-person/phone/:id',
      name: 'assign-to-person-phone-id',
      component: () => import('@/views/Phone2PersonView.vue')
    },
    {
      path: '/assign-to-company/phone/:id',
      name: 'assign-to-company-phone-id',
      component: () => import('@/views/Phone2CompanyView.vue')
    },
    {
      path: '/xaccount/',
      name: 'xaccount',
      component: () => import('@/views/XAccountView.vue')
    },
    {
      path: '/xaccount/:id',
      name: 'xaccount-id',
      component: () => import('@/views/XAccountView.vue')
    },
    {
      path: '/assign-to-person/xaccount/:id',
      name: 'assign-to-person-xaccount-id',
      component: () => import('@/views/XAccount2PersonView.vue')
    },
    {
      path: '/assign-to-company/xaccount/:id',
      name: 'assign-to-company-xaccount-id',
      component: () => import('@/views/XAccount2CompanyView.vue')
    },
    {
      path: '/telegram/',
      name: 'telegram',
      component: () => import('@/views/TelegramView.vue')
    },
    {
      path: '/telegram/:id',
      name: 'telegram-id',
      component: () => import('@/views/TelegramView.vue')
    },
    {
      path: '/assign-to-person/telegram/:id',
      name: 'assign-to-person-telegram-id',
      component: () => import('@/views/Telegram2PersonView.vue')
    },
    {
      path: '/assign-to-company/telegram/:id',
      name: 'assign-to-company-telegram-id',
      component: () => import('@/views/Telegram2CompanyView.vue')
    },
    {
      path: '/proof/',
      name: 'proof',
      component: () => import('@/views/ProofView.vue')
    },
    {
      path: '/proof/:id',
      name: 'proof-id',
      component: () => import('@/views/ProofView.vue')
    }
  ]
})

export default router
