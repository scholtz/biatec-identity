export interface IProof {
  proofType:
    | 'PERSON_NAME'
    | 'PERSON_BIRTH'
    | 'PERSON_GOVID'
    | 'COMPANY_REGISTRATION'
    | 'COMPANY_TAX_ID'
    | 'RESIDENCY_ADDRESS'
    | 'PROFESSIONAL_TRADER_REGISTRATION'
    | undefined
  documentId: string
  note: string
}
