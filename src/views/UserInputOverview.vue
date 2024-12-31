<script setup lang="ts">
import Layout from '@/layouts/PublicLayout.vue'
import { useAppStore } from '@/stores/app'
import { RouterLink } from 'vue-router'

import { addressFormatter } from '@/scripts/formatters/addressFormatter'
import { companyFormatter } from '@/scripts/formatters/companyFormatter'
import { discordFormatter } from '@/scripts/formatters/discordFormatter'
import { documentFormatter } from '@/scripts/formatters/documentFormatter'
import { personFormatter } from '@/scripts/formatters/personFormatter'
import { phoneFormatter } from '@/scripts/formatters/phoneFormatter'
import { telegramFormatter } from '@/scripts/formatters/telegramFormatter'
import { xAccountFormatter } from '@/scripts/formatters/xAccountFormatter'
import { fileFormatter } from '@/scripts/formatters/fileFormatter'
import { proofFormatter } from '@/scripts/formatters/proofFormatter'

import { onMounted } from 'vue'

const store = useAppStore()

onMounted(() => {
  try {
    store.state.forceAuth = true
    if (!store.state.userInput.verificationClaim) {
      const localData = localStorage.getItem('user-input')
      if (localData) {
        store.state.userInput = JSON.parse(localData)
      }
    } else {
      localStorage.setItem('user-input', JSON.stringify(store.state.userInput))
    }
  } catch (e) {
    console.error('recovery failed', e)
  }
})

const resetForm = () => {
  store.state.userInput.verificationClaim = ''
  localStorage.removeItem('user-input')
}
</script>
<template>
  <Layout>
    <Fieldset
      legend="KYC Form"
      class="flex flex-col flex-1"
      pt:content:class="flex gap-2 flex flex-col"
    >
      <Fieldset
        legend="Claim type"
        class="flex flex-col"
        pt:content:class="flex gap-2 flex flex-col w-full flex-col-3"
      >
        <p v-if="!store.state.userInput.verificationClaim">
          If you as a individual is owner of the account {{ store.state.authState.account }}, please
          select the "Natural person" verification claim. This will allow you to do instant level 1
          verification for your account, and after the KYC check you may receive the verification
          level 2 status.
        </p>
        <Button
          v-if="
            !store.state.userInput.verificationClaim ||
            store.state.userInput.verificationClaim == 'PERSON'
          "
          :severity="store.state.userInput.verificationClaim == 'PERSON' ? 'primary' : 'secondary'"
          @click="store.state.userInput.verificationClaim = 'PERSON'"
          >Natural Person</Button
        >
        <p v-if="!store.state.userInput.verificationClaim">
          If the company where you work is owner of the account {{ store.state.authState.account }},
          please select the "Legal Entity" verification claim. This will allow your company receive
          instant level 1 verification for the account, and after the KYC check you may receive the
          verification level 2 status. If you represent the institution like the Bank, Hadge fund,
          or regulated securities trader please select the professional trader claim option.
        </p>
        <Button
          v-if="
            !store.state.userInput.verificationClaim ||
            store.state.userInput.verificationClaim == 'LEGAL_ENTITY'
          "
          :severity="
            store.state.userInput.verificationClaim == 'LEGAL_ENTITY' ? 'primary' : 'secondary'
          "
          @click="store.state.userInput.verificationClaim = 'LEGAL_ENTITY'"
        >
          Legal Entity
        </Button>
        <p v-if="!store.state.userInput.verificationClaim">
          If you represent the institution like the Bank, Hadge fund, or regulated securities trader
          please select the professional trader claim option. With verification level 4 you may have
          option to trade only with other institutional traders at AVM DeFi.
        </p>
        <Button
          v-if="
            !store.state.userInput.verificationClaim ||
            store.state.userInput.verificationClaim == 'PROFESSIONAL_TRADER'
          "
          :severity="
            store.state.userInput.verificationClaim == 'PROFESSIONAL_TRADER'
              ? 'primary'
              : 'secondary'
          "
          @click="store.state.userInput.verificationClaim = 'PROFESSIONAL_TRADER'"
        >
          Professional trader company
        </Button>
        <Button
          v-if="store.state.userInput.verificationClaim"
          severity="secondary"
          @click="resetForm"
        >
          Reset
        </Button>
      </Fieldset>
      <div v-if="store.state.userInput.verificationClaim" class="flex flex-col gap-2">
        <Fieldset
          :toggleable="true"
          legend="Entities"
          class="m-2 gap-6 flex flex-col w-full"
          pt:content:class="flex gap-2 flex flex-col md:flex-row w-full flex-col-3"
        >
          <Fieldset
            v-if="store.state.userInput.verificationClaim != 'PERSON'"
            :legend="
              Object.keys(store.state.userInput.companies).length <= 1 ? 'Company' : 'Companies'
            "
            class="m-2 gap-6 flex flex-col w-full"
            pt:content:class="flex gap-2 flex flex-col w-full"
          >
            <div v-for="(company, id) in store.state.userInput.companies">
              <RouterLink :to="`/company/${id}`">
                <Button severity="secondary" variant="link">
                  {{ companyFormatter(company) }}
                </Button>
              </RouterLink>
              <Button severity="secondary" @click="delete store.state.userInput.companies[id]"
                >X</Button
              >
            </div>
            <RouterLink :to="`/company`">
              <Button severity="primary"> Add company </Button>
            </RouterLink>
          </Fieldset>

          <Fieldset
            :legend="Object.keys(store.state.userInput.people).length <= 1 ? 'Person' : 'People'"
            class="m-2 gap-6 flex flex-col w-full"
            pt:content:class="flex gap-2 flex flex-col w-full"
          >
            <div v-for="(person, id) in store.state.userInput.people">
              <RouterLink :to="`/person/${id}`">
                <Button severity="secondary" variant="link">
                  {{ personFormatter(person) }}
                </Button>
              </RouterLink>
              <RouterLink
                :to="`/assign-to-company/person/${id}`"
                title="Assign person to company"
                v-if="store.state.userInput.verificationClaim != 'PERSON'"
              >
                <Button severity="secondary" class="m-2">
                  <OverlayBadge
                    :value="
                      Object.values(store.state.userInput.companyPeople ?? []).filter(
                        (c) => c.personId == id
                      ).length
                    "
                  >
                    <i class="pi pi-warehouse" />
                  </OverlayBadge>
                </Button>
              </RouterLink>
              <Button severity="secondary" @click="delete store.state.userInput.people[id]">
                X
              </Button>
            </div>
            <RouterLink
              :to="`/person`"
              v-if="
                (store.state.userInput.verificationClaim == 'PERSON' &&
                  Object.keys(store.state.userInput.people).length < 1) ||
                store.state.userInput.verificationClaim != 'PERSON'
              "
            >
              <Button severity="primary"> Add person </Button>
            </RouterLink>
          </Fieldset>
        </Fieldset>
        <Fieldset
          :toggleable="true"
          legend="Contacts"
          class="m-2 gap-6 flex flex-col w-full"
          pt:content:class="flex gap-2 flex flex-col md:flex-row w-full flex-col-3"
        >
          <Fieldset
            :legend="
              Object.keys(store.state.userInput.addresses).length <= 1 ? 'Address' : 'Addresses'
            "
            class="m-2 gap-6 flex flex-col w-full"
            pt:content:class="flex gap-2 flex flex-col w-full"
          >
            <div v-for="(address, id) in store.state.userInput.addresses">
              <RouterLink :to="`/address/${id}`">
                <Button severity="secondary" variant="link">
                  {{ addressFormatter(address) }}
                </Button>
              </RouterLink>
              <RouterLink :to="`/assign-to-person/address/${id}`" title="Assign address to person">
                <Button severity="secondary" class="m-2">
                  <OverlayBadge
                    :value="
                      Object.values(store.state.userInput.personAddresses).filter(
                        (c) => c.addressId == id
                      ).length
                    "
                  >
                    <i class="pi pi-user" />
                  </OverlayBadge>
                </Button>
              </RouterLink>
              <RouterLink
                :to="`/assign-to-company/address/${id}`"
                title="Assign address to company"
              >
                <Button severity="secondary" class="m-2">
                  <OverlayBadge
                    :value="
                      Object.values(store.state.userInput.companyAddresses).filter(
                        (c) => c.addressId == id
                      ).length
                    "
                  >
                    <i class="pi pi-warehouse" />
                  </OverlayBadge>
                </Button>
              </RouterLink>
              <Button severity="secondary" @click="delete store.state.userInput.addresses[id]">
                X
              </Button>
            </div>
            <RouterLink :to="`/address`">
              <Button severity="primary"> Add address </Button>
            </RouterLink>
          </Fieldset>

          <Fieldset
            :legend="Object.keys(store.state.userInput.phones).length <= 1 ? 'Phone' : 'Phones'"
            class="m-2 gap-6 flex flex-col w-full"
            pt:content:class="flex gap-2 flex flex-col w-full"
          >
            <div v-for="(phone, id) in store.state.userInput.phones">
              <RouterLink :to="`/phone/${id}`">
                <Button severity="secondary" variant="link">
                  {{ phoneFormatter(phone) }}
                </Button>
              </RouterLink>
              <RouterLink :to="`/assign-to-person/phone/${id}`" title="Assign phone to person">
                <Button severity="secondary" class="m-2">
                  <OverlayBadge
                    :value="
                      Object.values(store.state.userInput.personPhones).filter(
                        (c) => c.phoneId == id
                      ).length
                    "
                  >
                    <i class="pi pi-user" />
                  </OverlayBadge>
                </Button>
              </RouterLink>
              <RouterLink :to="`/assign-to-company/phone/${id}`" title="Assign phone to company">
                <Button severity="secondary" class="m-2">
                  <OverlayBadge
                    :value="
                      Object.values(store.state.userInput.companyPhones).filter(
                        (c) => c.phoneId == id
                      ).length
                    "
                  >
                    <i class="pi pi-warehouse" />
                  </OverlayBadge>
                </Button>
              </RouterLink>
              <Button severity="secondary" @click="delete store.state.userInput.phones[id]">
                X
              </Button>
            </div>
            <RouterLink :to="`/phone`">
              <Button severity="primary"> Add phone </Button>
            </RouterLink>
          </Fieldset>
          <Fieldset
            :legend="
              Object.keys(store.state.userInput.telegramAccounts).length <= 1
                ? 'Telegram Account'
                : 'Telegram Accounts'
            "
            class="m-2 gap-6 flex flex-col w-full"
            pt:content:class="flex gap-2 flex flex-col w-full"
          >
            <div v-for="(telegram, id) in store.state.userInput.telegramAccounts">
              <RouterLink :to="`/telegram/${id}`">
                <Button severity="secondary" variant="link">
                  {{ telegramFormatter(telegram) }}
                </Button>
              </RouterLink>
              <RouterLink
                :to="`/assign-to-person/telegram/${id}`"
                title="Assign telegram to person"
              >
                <Button severity="secondary" class="m-2">
                  <OverlayBadge
                    :value="
                      Object.values(store.state.userInput.personTelegramAccounts).filter(
                        (c) => c.telegramId == id
                      ).length
                    "
                  >
                    <i class="pi pi-user" />
                  </OverlayBadge>
                </Button>
              </RouterLink>
              <RouterLink
                :to="`/assign-to-company/telegram/${id}`"
                title="Assign telegram to company"
              >
                <Button severity="secondary" class="m-2">
                  <OverlayBadge
                    :value="
                      Object.values(store.state.userInput.companyTelegramAccounts).filter(
                        (c) => c.telegramId == id
                      ).length
                    "
                  >
                    <i class="pi pi-warehouse" />
                  </OverlayBadge>
                </Button>
              </RouterLink>
              <Button
                severity="secondary"
                @click="delete store.state.userInput.telegramAccounts[id]"
              >
                X
              </Button>
            </div>
            <RouterLink :to="`/telegram`">
              <Button severity="primary"> Add Telegram account </Button>
            </RouterLink>
          </Fieldset>
        </Fieldset>
        <Fieldset
          :toggleable="true"
          legend="Socials"
          class="m-2 gap-6 flex flex-col w-full"
          pt:content:class="flex gap-2 flex flex-col md:flex-row w-full flex-col-3"
        >
          <Fieldset
            :legend="
              Object.keys(store.state.userInput.xAccounts).length <= 1 ? 'X Account' : 'X Accounts'
            "
            class="m-2 gap-6 flex flex-col w-full"
            pt:content:class="flex gap-2 flex flex-col w-full"
          >
            <div v-for="(xAccount, id) in store.state.userInput.xAccounts">
              <RouterLink :to="`/xaccount/${id}`">
                <Button severity="secondary" variant="link">
                  {{ xAccountFormatter(xAccount) }}
                </Button>
              </RouterLink>
              <RouterLink
                :to="`/assign-to-person/xaccount/${id}`"
                title="Assign X account to person"
              >
                <Button severity="secondary" class="m-2">
                  <OverlayBadge
                    :value="
                      Object.values(store.state.userInput.personXAccounts).filter(
                        (c) => c.xAccountId == id
                      ).length
                    "
                  >
                    <i class="pi pi-user" />
                  </OverlayBadge>
                </Button>
              </RouterLink>
              <RouterLink
                :to="`/assign-to-company/xaccount/${id}`"
                title="Assign X account to company"
              >
                <Button severity="secondary" class="m-2">
                  <OverlayBadge
                    :value="
                      Object.values(store.state.userInput.companyXAccounts).filter(
                        (c) => c.xAccountId == id
                      ).length
                    "
                  >
                    <i class="pi pi-warehouse" />
                  </OverlayBadge>
                </Button>
              </RouterLink>
              <Button severity="secondary" @click="delete store.state.userInput.xAccounts[id]">
                X
              </Button>
            </div>
            <RouterLink :to="`/xaccount`">
              <Button severity="primary"> Add X account </Button>
            </RouterLink>
          </Fieldset>

          <Fieldset
            :legend="
              Object.keys(store.state.userInput.discordAccounts).length <= 1
                ? 'Discord Account'
                : 'Discord Accounts'
            "
            class="m-2 gap-6 flex flex-col w-full"
            pt:content:class="flex gap-2 flex flex-col w-full"
          >
            <div v-for="(discord, id) in store.state.userInput.discordAccounts">
              <RouterLink :to="`/discord/${id}`">
                <Button severity="secondary" variant="link">
                  {{ discordFormatter(discord) }}
                </Button>
              </RouterLink>
              <RouterLink
                :to="`/assign-to-person/discord/${id}`"
                title="Assign discord account to person"
              >
                <Button severity="secondary" class="m-2">
                  <OverlayBadge
                    :value="
                      Object.values(store.state.userInput.personDiscordAccounts).filter(
                        (c) => c.discordId == id
                      ).length
                    "
                  >
                    <i class="pi pi-user" />
                  </OverlayBadge>
                </Button>
              </RouterLink>
              <RouterLink
                :to="`/assign-to-company/discord/${id}`"
                title="Assign discord account to company"
              >
                <Button severity="secondary" class="m-2">
                  <OverlayBadge
                    :value="
                      Object.values(store.state.userInput.companyDiscordAccounts).filter(
                        (c) => c.discordId == id
                      ).length
                    "
                  >
                    <i class="pi pi-warehouse" />
                  </OverlayBadge>
                </Button>
              </RouterLink>
              <Button
                severity="secondary"
                @click="delete store.state.userInput.discordAccounts[id]"
              >
                X
              </Button>
            </div>
            <RouterLink :to="`/discord`">
              <Button severity="primary"> Add Discord account </Button>
            </RouterLink>
          </Fieldset>
        </Fieldset>
        <Fieldset
          :toggleable="true"
          legend="Files, Documents and Proofs"
          class="m-2 gap-6 flex flex-col w-full"
          pt:content:class="flex gap-2 flex flex-col md:flex-row w-full flex-col-3"
        >
          <Fieldset
            :legend="
              Object.keys(store.state.userInput.documents).length <= 1 ? 'Document' : 'Documents'
            "
            class="m-2 gap-6 flex flex-col w-full"
            pt:content:class="flex gap-2 flex flex-col w-full"
          >
            <div v-for="(document, id) in store.state.userInput.documents">
              <RouterLink :to="`/document/${id}`">
                <Button severity="secondary" variant="link">
                  {{ documentFormatter(document) }}
                </Button>
              </RouterLink>
              <Button severity="secondary" @click="delete store.state.userInput.documents[id]">
                X
              </Button>
            </div>
            <RouterLink :to="`/document`">
              <Button severity="primary"> Add document </Button>
            </RouterLink>
          </Fieldset>

          <Fieldset
            :legend="Object.keys(store.state.userInput.documents).length <= 1 ? 'File' : 'Files'"
            class="m-2 gap-6 flex flex-col w-full"
            pt:content:class="flex gap-2 flex flex-col w-full"
          >
            <div v-for="(file, id) in store.state.userInput.files">
              <RouterLink :to="`/file/${id}`">
                <Button severity="secondary" variant="link">
                  {{ fileFormatter(file) }}
                </Button>
              </RouterLink>

              <RouterLink :to="`/assign-to-document/file/${id}`" title="Assign file to document">
                <Button severity="secondary" class="m-2">
                  <OverlayBadge
                    :value="
                      Object.values(store.state.userInput.documentsFiles).filter(
                        (c) => c.fileId == id
                      ).length
                    "
                  >
                    <i class="pi pi-file-arrow-up" />
                  </OverlayBadge>
                </Button>
              </RouterLink>

              <Button severity="secondary" @click="delete store.state.userInput.documents[id]">
                X
              </Button>
            </div>
            <RouterLink :to="`/file`">
              <Button severity="primary"> Add file </Button>
            </RouterLink>
          </Fieldset>

          <Fieldset
            :legend="Object.keys(store.state.userInput.documents).length <= 1 ? 'Proof' : 'Proofs'"
            class="m-2 gap-6 flex flex-col w-full"
            pt:content:class="flex gap-2 flex flex-col w-full"
          >
            <div v-for="(proof, id) in store.state.userInput.proofs">
              <RouterLink :to="`/proof/${id}`">
                <Button severity="secondary" variant="link">
                  {{ proofFormatter(proof) }}
                </Button>
              </RouterLink>

              <Button severity="secondary" @click="delete store.state.userInput.proofs[id]">
                X
              </Button>
            </div>
            <RouterLink :to="`/proof`">
              <Button severity="primary"> Add proof </Button>
            </RouterLink>
          </Fieldset>
        </Fieldset>
      </div>
    </Fieldset>
  </Layout>
</template>
