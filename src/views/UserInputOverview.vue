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
import type { KYCInput } from '@/interface/KYCInput'

import { onMounted, reactive, watch } from 'vue'
import axios from 'axios'
import AvmAddress from '@/components/AvmAddress.vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const store = useAppStore()

const state = reactive({
  savingKYC: false
})

onMounted(async () => {
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

    if (store.state.authState.arc14Header) {
      await loadFromGateway()
    }
  } catch (e: any) {
    console.error('recovery failed', e)

    toast.add({
      detail: 'Recovery failed: ' + e.message,
      severity: 'error',
      closable: true,
      life: 10000
    })
  }
})

const loadFromGateway = async () => {
  try {
    if (store.state.userInput.verificationClaim) {
      // do not override the loaded data
      return
    }
    const isVerifierResponse = await axios.get(`${store.state.fileGateway}/v1/is-biatec-verifier`, {
      headers: { Authorization: store.state.authState.arc14Header }
    })
    store.state.isVerifier = false
    if (isVerifierResponse.status === 200) {
      if (isVerifierResponse.data) {
        store.state.isVerifier = true
        return
      }
    }

    var docId = 'kyc-form.json'
    const response = await axios.get(`${store.state.fileGateway}/v1/document/utf8/${docId}`, {
      headers: { Authorization: store.state.authState.arc14Header }
    })
    if (response.status === 200) {
      console.log('response', response)
      const data = response.data as KYCInput

      if (data.verificationClaim) {
        console.log('loaded KYCInput from secure storage', data)
        store.state.userInput = data
      }
    }
  } catch (e: any) {
    console.error('form not loaded', e)

    toast.add({
      detail: 'Form failed to load. ' + e.message,
      severity: 'error',
      closable: true,
      life: 10000
    })
  }
}
const loadFromGatewayAdmin = async () => {
  try {
    var docId = 'kyc-form.json'
    const response = await axios.get(
      `${store.state.fileGateway}/v1/document/utf8/${store.state.verificationUser}/${docId}`,
      {
        headers: { Authorization: store.state.authState.arc14Header }
      }
    )
    store.state.verificationDataLoaded = false
    if (response.status === 200) {
      console.log('response', response)
      store.state.userInput = response.data
      store.state.verificationDataLoaded = true
    }
  } catch (e: any) {
    console.error('form not loaded', e)

    toast.add({
      detail: 'Form failed to load. ' + e.message,
      severity: 'error',
      closable: true,
      life: 10000
    })
  }
}
const saveFormToGatewayClick = async () => {
  try {
    state.savingKYC = true
    const docId = 'kyc-form.json'
    const url = `${store.state.fileGateway}/v1/document/utf8/${docId}`
    const headers = {
      Authorization: store.state.authState.arc14Header,
      'Content-Type': 'application/json'
    }
    const data = JSON.stringify(JSON.stringify(store.state.userInput))

    const response = await axios.put(url, data, { headers })
    console.log('Success:', response.data)
    state.savingKYC = false
    toast.add({
      detail: 'Form has been saved.',
      severity: 'info',
      closable: true,
      life: 5000
    })
  } catch (e: any) {
    state.savingKYC = false
    console.error('Error:', e.response?.data || e.message)

    toast.add({
      detail: 'Form failed to be saved. ' + (e.response?.data || e.message),
      severity: 'error',
      closable: true,
      life: 10000
    })
  }
}
watch(
  () => store.state.authState.arc14Header,
  async () => {
    await loadFromGateway()
  }
)
const resetForm = () => {
  store.state.userInput.verificationClaim = ''
  localStorage.removeItem('user-input')
}

const formValidation = (): string[] => {
  var ret: string[] = []

  switch (store.state.userInput.verificationClaim) {
    case '':
      ret.push('Verification claim not selected')
      break
    case 'PERSON':
      const personKeys = Object.keys(store.state.userInput.people)
      if (personKeys.length != 1) {
        ret.push('Only single person can be in the collection of people')
      }
      const person = personKeys[0]

      const companiesKeys = Object.keys(store.state.userInput.companies)
      if (companiesKeys.length != 0) {
        ret.push('Company must not be defined in the person verification form')
      }

      /// ADDRESS
      const addressKeys = Object.keys(store.state.userInput.addresses)

      const wrongAddresses = Object.values(store.state.userInput.personAddresses).filter(
        (kv) => !addressKeys.includes(kv.addressId)
      )
      if (wrongAddresses.length > 0) {
        ret.push(
          'Wrong reference in at least one of the person address. The address id does not exists'
        )
      }
      const wrongAddressesCompanies = Object.values(store.state.userInput.companyAddresses)
      if (wrongAddressesCompanies.length > 0) {
        ret.push('Do not fill in the companies addresses with person verification form.')
      }
      const correctAddressesRESIDENTIAL = Object.values(
        store.state.userInput.personAddresses
      ).filter(
        (kv) =>
          addressKeys.includes(kv.addressId) && kv.personId == person && kv.type == 'RESIDENTIAL'
      )
      if (correctAddressesRESIDENTIAL.length != 1) {
        ret.push(
          'Please define at least one residential address. It is address where you really live and you can proof it by the bills.'
        )
      }

      const correctAddressesPERNAMENT = Object.values(store.state.userInput.personAddresses).filter(
        (kv) =>
          addressKeys.includes(kv.addressId) && kv.personId == person && kv.type == 'PERNAMENT'
      )
      if (correctAddressesPERNAMENT.length != 1) {
        ret.push(
          'Please define at least one pernament address. It is the official address stated on your government document.'
        )
      }

      /// PHONES
      const phonesKeys = Object.keys(store.state.userInput.phones)

      const wrongPersonPhones = Object.values(store.state.userInput.personPhones).filter(
        (kv) => !phonesKeys.includes(kv.phoneId)
      )
      if (wrongPersonPhones.length > 0) {
        ret.push(
          'Wrong reference in at least one of the person phones. The phone id does not exists'
        )
      }
      const wrongPhonesCompanies = Object.values(store.state.userInput.companyPhones)
      if (wrongPhonesCompanies.length > 0) {
        ret.push('Do not fill in the companies phones with person verification form.')
      }
      const correctPhones = Object.values(store.state.userInput.personPhones).filter(
        (kv) => phonesKeys.includes(kv.phoneId) && kv.personId == person
      )
      if (correctPhones.length == 0) {
        ret.push('Please define at least one personal phone.')
      }

      /// TELEGRAM
      const telegramKeys = Object.keys(store.state.userInput.telegramAccounts)

      const wrongPersonTelegramAccounts = Object.values(
        store.state.userInput.personTelegramAccounts
      ).filter((kv) => !telegramKeys.includes(kv.telegramId))
      if (wrongPersonTelegramAccounts.length > 0) {
        ret.push(
          'Wrong reference in at least one of the person telegram account. The phone id does not exists'
        )
      }
      const wrongTelegramAccountsCompanies = Object.values(
        store.state.userInput.companyTelegramAccounts
      )
      if (wrongTelegramAccountsCompanies.length > 0) {
        ret.push('Do not fill in the companies telegram account with person verification form.')
      }

      /// X
      const xKeys = Object.keys(store.state.userInput.xAccounts)

      const wrongPersonXAccounts = Object.values(store.state.userInput.personXAccounts).filter(
        (kv) => !telegramKeys.includes(kv.xAccountId)
      )
      if (wrongPersonXAccounts.length > 0) {
        ret.push(
          'Wrong reference in at least one of the person X account. The phone id does not exists'
        )
      }
      const wrongXAccountsCompanies = Object.values(store.state.userInput.companyXAccounts)
      if (wrongXAccountsCompanies.length > 0) {
        ret.push('Do not fill in the companies X account with person verification form.')
      }

      /// Discord
      const discordKeys = Object.keys(store.state.userInput.discordAccounts)

      const wrongPersonDiscordAccounts = Object.values(
        store.state.userInput.personDiscordAccounts
      ).filter((kv) => !discordKeys.includes(kv.discordId))
      if (wrongPersonDiscordAccounts.length > 0) {
        ret.push(
          'Wrong reference in at least one of the person X account. The phone id does not exists'
        )
      }
      const wrongDiscordAccountsCompanies = Object.values(
        store.state.userInput.companyDiscordAccounts
      )
      if (wrongDiscordAccountsCompanies.length > 0) {
        ret.push('Do not fill in the companies discord account with person verification form.')
      }

      /// Proofs

      // Birth date

      const proofBirth = Object.values(store.state.userInput.proofs).filter(
        (p) => p.proofType == 'PERSON_BIRTH'
      )
      let proofBirthFrontSide = false
      let proofBirthBackSide = false
      let proofBirthFullDoc = false
      if (proofBirth.length == 0) {
        ret.push(
          'Proof verifying your birth date is missing. Please provide the government document prooving your birth date, upload the file and create proof link to this document.'
        )
      } else {
        for (let birthProofInstance of proofBirth) {
          const proofBirthDocumentInstance =
            store.state.userInput.documents[birthProofInstance.documentId]
          if (!proofBirthDocumentInstance) {
            ret.push(
              `Document prooving the birth date is missing. ${birthProofInstance.documentId}`
            )
          } else {
            const fileProofBirth = Object.values(store.state.userInput.documentsFiles).filter(
              (p) => p.documentId == birthProofInstance.documentId
            )
            // ret.push(JSON.stringify(birthProofInstance.documentId))
            // ret.push(JSON.stringify(store.state.userInput.documentsFiles))
            // ret.push(JSON.stringify(proofBirthDocumentInstance))
            // ret.push(JSON.stringify(fileProofBirth))
            for (let fileProofBirthInstance of fileProofBirth) {
              const fileInstance = store.state.userInput.files[fileProofBirthInstance.fileId]
              switch (fileInstance.type) {
                case 'BACK':
                  proofBirthBackSide = true
                  break
                case 'FRONT':
                  proofBirthFrontSide = true
                  break
                default:
                  proofBirthFullDoc = true
              }
            }
          }
        }
      }
      if (proofBirth.length == 0) {
        // processed before
      } else if (proofBirthFullDoc) {
        // ok
      } else if (!proofBirthFrontSide) {
        ret.push(
          `Front side of the document prooving the birth date is missing. ${proofBirthFrontSide} ${proofBirthBackSide}`
        )
      } else if (!proofBirthBackSide) {
        ret.push('Back side of the document prooving the birth date is missing.')
      } else if (proofBirthFrontSide && proofBirthBackSide) {
        // ok
      } else {
        ret.push('File prooving the birth date is missing.')
      }

      break
  }

  return ret
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
        v-if="store.state.isVerifier"
        legend="Biatec verifier"
        class="flex flex-col flex-1"
        pt:content:class="flex gap-2 flex flex-col"
      >
        <InputTextField
          fieldName="userId"
          v-model="store.state.verificationUser"
          helpText="Address of user to be verified"
          labelText="User address"
        />
        <Button @click="loadFromGatewayAdmin">Load kyc form</Button>
      </Fieldset>
      <div
        v-if="
          !store.state.isVerifier || (store.state.isVerifier && store.state.verificationDataLoaded)
        "
      >
        <Fieldset
          legend="Claim type"
          class="flex flex-col"
          pt:content:class="flex gap-2 flex flex-col w-full flex-col-3"
        >
          <p v-if="!store.state.userInput.verificationClaim">
            If you as a individual is owner of the account {{ store.state.authState.account }},
            please select the "Natural person" verification claim. This will allow you to do instant
            level 1 verification for your account, and after the KYC check you may receive the
            verification level 2 status.
          </p>
          <Button
            v-if="
              !store.state.userInput.verificationClaim ||
              store.state.userInput.verificationClaim == 'PERSON'
            "
            :severity="
              store.state.userInput.verificationClaim == 'PERSON' ? 'primary' : 'secondary'
            "
            @click="store.state.userInput.verificationClaim = 'PERSON'"
            >Natural Person</Button
          >
          <p v-if="!store.state.userInput.verificationClaim">
            If the company where you work is owner of the account
            {{ store.state.authState.account }}, please select the "Legal Entity" verification
            claim. This will allow your company receive instant level 1 verification for the
            account, and after the KYC check you may receive the verification level 2 status. If you
            represent the institution like the Bank, Hadge fund, or regulated securities trader
            please select the professional trader claim option.
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
            If you represent the institution like the Bank, Hadge fund, or regulated securities
            trader please select the professional trader claim option. With verification level 4 you
            may have option to trade only with other institutional traders at AVM DeFi.
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
        <div v-if="store.state.userInput.verificationClaim" class="flex flex-col gap-2 mt-2">
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
                <RouterLink
                  :to="`/assign-to-person/address/${id}`"
                  title="Assign address to person"
                >
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
                Object.keys(store.state.userInput.xAccounts).length <= 1
                  ? 'X Account'
                  : 'X Accounts'
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
              :legend="
                Object.keys(store.state.userInput.documents).length <= 1 ? 'Proof' : 'Proofs'
              "
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
          <p>Your address: <AvmAddress :address="store.state.authState.account"></AvmAddress></p>
          <ul v-for="item in formValidation()">
            <li>{{ item }}</li>
          </ul>

          <ProgressSpinner
            style="width: 1em; height: 1em"
            strokeWidth="8"
            fill="transparent"
            animationDuration=".5s"
            aria-label="Save form to decentralized secure storage"
            v-if="state.savingKYC"
          />
          <Button
            v-if="!store.state.isVerifier"
            severity="primary"
            @click="saveFormToGatewayClick"
            :disabled="state.savingKYC"
          >
            Save form to decentralized secure storage
          </Button>
        </div>
      </div>
    </Fieldset>
  </Layout>
</template>
