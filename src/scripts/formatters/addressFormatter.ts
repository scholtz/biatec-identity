import type { IAddress } from '@/interface/IAddress'

export const addressFormatter = (address: IAddress) => {
  return `${address.street} ${address.streetNumber} ${address.streetLine2}, ${address.zipCode} ${address.city}, ${address.countryCode}`.trim()
}
