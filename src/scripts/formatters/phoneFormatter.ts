import type { IPhone } from '@/interface/IPhone'

export const phoneFormatter = (phone: IPhone) => {
  return `${phone.countryDialingCode}${phone.phoneNumber}`.trim()
}
