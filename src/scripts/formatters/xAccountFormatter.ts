import type { IXAccount } from '@/interface/IXAccount'

export const xAccountFormatter = (xAccount: IXAccount) => {
  return `${xAccount.xAccount}`.trim()
}
