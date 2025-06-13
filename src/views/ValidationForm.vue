<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import Layout from '@/layouts/PublicLayout.vue'
import { useToast } from 'primevue/usetoast'
import { Form } from '@primevue/forms'
import { FormField } from '@primevue/forms'

import { useAppStore } from '@/stores/app'
import { v7 as uuidv7 } from 'uuid'
import { useRoute, useRouter } from 'vue-router'
import InputTextField from '@/components/form/InputTextField.vue'
import CheckboxField from '@/components/form/CheckboxField.vue'
import DateField from '@/components/form/DateField.vue'
import axios from 'axios'

import {
  BiatecClammPoolClient,
  BiatecConfigProviderClient,
  BiatecIdentityProviderClient,
  BiatecPoolProviderClient,
  type FullConfig
} from 'biatec-concentrated-liquidity-amm'

import type algosdk from 'algosdk'

const store = useAppStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  store.state.forceAuth = true
  await loadUser()
})

const loadUser = async () => {
  const dummyAddress = 'TESTNTTTJDHIF5PJZUBTTDYYSKLCLM6KXCTWIOOTZJX5HO7263DPPMM2SU'
  //       const dummyTransactionSigner = async (
  //         txnGroup: algosdk.Transaction[],
  //         indexesToSign: number[]
  //       ): Promise<Uint8Array[]> => {
  //         console.log('transactionSigner', txnGroup, indexesToSign)
  //         return [] as Uint8Array[]
  //       }
  //       const algorand = AlgorandClient.fromConfig({
  //   algodConfig: {
  //     server: 'https://mainnet-api.4160.nodely.dev',
  //     port: 443,
  //     token: ''
  //   },
  //   indexerConfig: {
  //     server: 'https://mainnet-idx.4160.nodely.dev',
  //     port: 443,
  //     token: ''
  //   }
  // const clientIdentity = new BiatecIdentityProviderClient({
  //           algorand: state.algorand,
  //           appId: 3074197744n,
  //           defaultSender: dummyAddress,
  //           defaultSigner: dummyTransactionSigner
  //         })

  const response = await axios.get(
    `${store.state.fileGateway}/v1/user-info/${route.params['userId']}`,
    { headers: { Authorization: store.state.authState.arc14Header } }
  )
  if (response.data) {
    state.obj = response.data as ValidationObj
  } else {
    toast.add({ severity: 'warn', summary: 'User not found', life: 3000 })
  }
}
const resolver = () => {
  const errors: any = {}

  if (state.obj.verificationStatus === undefined || state.obj.verificationStatus === null) {
    errors.verificationStatus = [{ message: 'Verification status is required.' }]
  }
  if (state.obj.verificationClass === undefined || state.obj.verificationClass === null) {
    errors.verificationClass = [{ message: 'Verification class is required.' }]
  }
  // if (!state.obj.personUuid && !state.obj.legalEntityUuid) {
  //   errors.personUuid = [{ message: 'Either personUuid or legalEntityUuid is required.' }]
  //   errors.legalEntityUuid = [{ message: 'Either personUuid or legalEntityUuid is required.' }]
  // }

  return {
    errors
  }
}
const onFormSubmit = async ({ valid }) => {
  try {
    if (valid) {
      // let id = route.params['id'] as string
      // if (!id) id = uuidv7()
      // if (!store.state.userInput.verificationStatuses) store.state.userInput.verificationStatuses = {}
      // store.state.userInput.verificationStatuses[id] = state.obj
      const response = await axios.post(
        `${store.state.fileGateway}/v1/validate-document/${route.params['userId']}?validationFailureReason=${encodeURIComponent(state.error)}`,
        state.obj,
        { headers: { Authorization: store.state.authState.arc14Header } }
      )
      if (response.status < 200 || response.status >= 300) {
        throw new Error('Failed to submit form')
      }
      toast.add({ severity: 'success', summary: 'Form has been submitted', life: 3000 })
      router.push('/user-input-overview')
    } else {
      throw new Error('The form contains errors')
    }
  } catch (error: any) {
    console.error('Error submitting form:', error)
    toast.add({ severity: 'error', summary: error.message, life: 3000 })
  }
}

const goBack = () => {
  router.push('/user-input-overview')
}

const FEE_MULTIPLIER_BASE = 1e9
interface ValidationObj {
  verificationClass: number
  isLocked: boolean
  feeMultiplier: number
  feeMultiplierBase: number
  kycExpiration: number
  investorForExpiration: number
  verificationStatus: number
  isCompany: boolean
  personUuid: string
  legalEntityUuid: string
  biatecEngagementPoints: number
  biatecEngagementRank: number
  avmEngagementPoints: number
  avmEngagementRank: number
  tradingEngagementPoints: number
  tradingEngagementRank: number
  isProfessionalInvestor: boolean
}

const defaultObj: ValidationObj = {
  verificationClass: 0,
  isLocked: false,
  feeMultiplier: 2 * FEE_MULTIPLIER_BASE,
  feeMultiplierBase: FEE_MULTIPLIER_BASE,
  kycExpiration: 0,
  investorForExpiration: 0,
  verificationStatus: 0,
  isCompany: false,
  personUuid: '',
  legalEntityUuid: '',
  biatecEngagementPoints: 0,
  biatecEngagementRank: 0,
  avmEngagementPoints: 0,
  avmEngagementRank: 0,
  tradingEngagementPoints: 0,
  tradingEngagementRank: 0,
  isProfessionalInvestor: false
}
const state = reactive({
  obj: defaultObj,
  error: ''
})

// Verification status options
const verificationStatusOptions = [
  { value: 0, label: 'No information about user' },
  { value: 1, label: 'Box created for address' },
  { value: 2, label: 'Email verified' },
  { value: 4, label: 'Mobile Phone verified' },
  { value: 8, label: 'Address verified' },
  { value: 16, label: 'Address verified' },
  { value: 32, label: 'X account verified' },
  { value: 64, label: 'Discord account verified' },
  { value: 128, label: 'Telegram account verified' },
  { value: 256, label: 'First government document with gov id stored in secure storage' },
  { value: 512, label: 'Second government document with gov id stored in secure storage' },
  { value: 1024, label: 'Corporation government documents stored in secure storage' },
  { value: 2048, label: 'First government document verified by online verification process' },
  { value: 4096, label: 'Second government document verified by online verification process' },
  {
    value: 8192,
    label: 'Corporation government documents verified by online verification process'
  },
  { value: 16384, label: 'First government document verified by in person verification process' },
  { value: 32768, label: 'Second government document verified by in person verification process' },
  {
    value: 65536,
    label: 'Corporation government documents verified by in person verification process'
  }
]

const selectedVerificationStatuses = computed<number[]>({
  get() {
    const selected: number[] = []
    for (const option of verificationStatusOptions) {
      if (option.value === 0) {
        if (state.obj.verificationStatus === 0) {
          selected.push(option.value)
        }
      } else {
        if ((state.obj.verificationStatus & option.value) === option.value) {
          selected.push(option.value)
        }
      }
    }
    return selected
  },
  set(newValues: number[]) {
    state.obj.verificationStatus = newValues.reduce((sum, value) => sum + value, 0)
    console.log('Setting verification statuses:', newValues, state.obj.verificationStatus)
  }
})

const kycExpirationDate = computed({
  get() {
    return state.obj.kycExpiration ? new Date(state.obj.kycExpiration * 1000) : null
  },
  set(val: Date | null) {
    state.obj.kycExpiration = val ? Math.floor(val.getTime() / 1000) : 0
  }
})

const investorForExpirationDate = computed({
  get() {
    return state.obj.investorForExpiration ? new Date(state.obj.investorForExpiration * 1000) : null
  },
  set(val: Date | null) {
    state.obj.investorForExpiration = val ? Math.floor(val.getTime() / 1000) : 0
  }
})
const feeMultiplierNum = computed({
  get() {
    return state.obj.feeMultiplier ? state.obj.feeMultiplier / state.obj.feeMultiplierBase : 2
  },
  set(val: number | bigint | null) {
    state.obj.feeMultiplier = Math.round(Number(val) * state.obj.feeMultiplierBase)
  }
})
</script>

<template>
  <Layout>
    <Form v-slot="$form" :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <Fieldset
        legend="Verification Status"
        class="m-6 gap-6 flex flex-col"
        pt:content:class="flex gap-2 flex flex-col"
      >
        <div class="field">
          <label class="block text-sm font-medium mb-2">Verification Status</label>
          <div
            class="flex flex-col gap-2 max-h-60 overflow-y-auto border border-gray-300 p-3 rounded"
          >
            <div
              v-for="option in verificationStatusOptions"
              :key="option.value"
              class="flex items-center gap-2"
            >
              <input
                type="checkbox"
                :id="`verification-${option.value}`"
                :value="option.value"
                v-model="selectedVerificationStatuses"
                class="rounded border-gray-300"
              />
              <label :for="`verification-${option.value}`" class="text-sm cursor-pointer">
                {{ option.label }} ({{ option.value }})
              </label>
            </div>
          </div>
          <small class="text-gray-600 mt-1">
            Current value: {{ state.obj.verificationStatus }}
          </small>
        </div>
        <div class="field">
          <label class="block text-sm font-medium mb-2">Verification Class</label>
          <select v-model.number="state.obj.verificationClass" class="p-2 border rounded">
            <option :value="0">No information about user</option>
            <option :value="1">KYC filled in</option>
            <option :value="2">KYC checked by online process</option>
            <option :value="3">In person verification</option>
            <option :value="4">Professional investor verified</option>
          </select>
        </div>
        <label class="block text-sm font-medium mb-2">Is company</label>
        <CheckboxField
          fieldName="isCompany"
          v-model="state.obj.isCompany"
          labelText="Is Company"
          helpText="Check if this is a company."
        />
        <label class="block text-sm font-medium mb-2">Person UUID</label>
        <InputTextField
          fieldName="personUuid"
          v-model="state.obj.personUuid"
          labelText="Person UUID"
          helpText="UUID of the person (if applicable)."
        />
        <label class="block text-sm font-medium mb-2">Legal entity UUID</label>
        <InputTextField
          fieldName="legalEntityUuid"
          v-model="state.obj.legalEntityUuid"
          labelText="Legal Entity UUID"
          helpText="UUID of the legal entity (if applicable)."
        />
        <label class="block text-sm font-medium mb-2">Biatec Engagement Points</label>
        <InputNumber
          fieldName="biatecEngagementPoints"
          v-model.number="state.obj.biatecEngagementPoints"
          labelText="Biatec Engagement Points"
          helpText="Biatec engagement points."
          type="number"
        />
        <label class="block text-sm font-medium mb-2">Biatec Engagement Rank</label>
        <InputNumber
          fieldName="biatecEngagementRank"
          v-model.number="state.obj.biatecEngagementRank"
          labelText="Biatec Engagement Rank"
          helpText="Biatec engagement rank."
          type="number"
        />
        <label class="block text-sm font-medium mb-2">AVM Engagement Points</label>
        <InputNumber
          fieldName="avmEngagementPoints"
          v-model.number="state.obj.avmEngagementPoints"
          labelText="AVM Engagement Points"
          helpText="AVM engagement points."
          type="number"
        />
        <label class="block text-sm font-medium mb-2">AVM Engagement Rank</label>
        <InputNumber
          fieldName="avmEngagementRank"
          v-model.number="state.obj.avmEngagementRank"
          labelText="AVM Engagement Rank"
          helpText="AVM engagement rank."
          type="number"
        />
        <label class="block text-sm font-medium mb-2">Trading Engagement Points</label>
        <InputNumber
          fieldName="tradingEngagementPoints"
          v-model.number="state.obj.tradingEngagementPoints"
          labelText="Trading Engagement Points"
          helpText="Trading engagement points."
          type="number"
        />
        <label class="block text-sm font-medium mb-2">Trading Engagement Rank</label>
        <InputNumber
          fieldName="tradingEngagementRank"
          v-model.number="state.obj.tradingEngagementRank"
          labelText="Trading Engagement Rank"
          helpText="Trading engagement rank."
          type="number"
        />
        <CheckboxField
          fieldName="isLocked"
          v-model="state.obj.isLocked"
          labelText="Is Locked"
          helpText="Check if the verification is locked."
        />
        <label class="block text-sm font-medium mb-2"
          >Fee Multiplier {{ state.obj.feeMultiplier }}</label
        >
        <InputNumber
          fieldName="feeMultiplier"
          v-model.number="feeMultiplierNum"
          labelText="Fee Multiplier"
          helpText="Fee multiplier value."
          type="number"
          :min="1"
          :step="0.1"
          :max="5"
        />
        <label class="block text-sm font-medium mb-2">KYC expiration date</label>

        <DatePicker
          fieldName="kycExpiration"
          v-model="kycExpirationDate"
          labelText="KYC Expiration"
          helpText="KYC expiration date and time."
        />
        <label class="block text-sm font-medium mb-2">Investor information expiration date</label>
        <DatePicker
          fieldName="investorForExpiration"
          v-model="investorForExpirationDate"
          labelText="Investor For Expiration"
          helpText="Investor for expiration timestamp."
          type="number"
        />
        <label class="block text-sm font-medium mb-2">Is Professional Investor</label>
        <CheckboxField
          fieldName="isProfessionalInvestor"
          v-model="state.obj.isProfessionalInvestor"
          labelText="Is Professional Investor"
          helpText="Check if professional investor."
        />

        <label class="block text-sm font-medium mb-2">
          Validation form error. Keep empty for valid response.
        </label>
        <InputTextField
          fieldName="personUuid"
          v-model="state.error"
          labelText="Text to show user why his verification failed"
          helpText="Text to show user why his verification failed."
        />

        <Button type="submit" severity="primary" label="Save user verification" />
        <Button severity="secondary" label="Close without saving" @click="goBack" />
      </Fieldset>
    </Form>
  </Layout>
</template>
