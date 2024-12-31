export interface ICompanyPeople {
  type: 'CEO' | 'COO' | 'CTO' | 'CFO' | 'LAWYER' | 'EMPLOYEE' | 'OTHER' | undefined
  companyId: string
  personId: string
  note: string
}
