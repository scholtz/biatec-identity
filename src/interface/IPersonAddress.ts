export interface IPersonAddress {
  personId: string
  addressId: string
  type: 'RESIDENTIAL' | 'PERNAMENT' | 'TEMPORARY' | 'OTHER' | undefined
  note: string
}
