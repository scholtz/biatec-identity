export interface ICompanyAddress {
  companyId: string
  addressId: string
  type: 'LEGAL_SEAT' | 'BRANCH' | undefined
  note: string
}
