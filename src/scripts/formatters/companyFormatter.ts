import type { ICompany } from '@/interface/ICompany'

export const companyFormatter = (company: ICompany) => {
  return `${company.name}`.trim()
}
