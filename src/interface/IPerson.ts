export interface IPerson {
  titleBefore: string
  firstName: string
  middleName: string
  lastName: string
  titleAfter: string
  birthDate: Date | undefined
  birthPlace: string
  birthCountry: string
  residencyCountry: string
  taxCountry: string
  govId: string
  isPEP: boolean
}
