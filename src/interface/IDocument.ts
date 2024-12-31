export interface IDocument {
  type:
    | 'GOV_ID'
    | 'DRIVING_LICENSE'
    | 'PASSPORT'
    | 'BANK_STATEMENT'
    | 'PHONE_BILL'
    | 'TRADE_REGISTRY_DOC'
    | 'TAX_REGISTRATION_DOC'
    | 'PROFESSIONAL_TRADER_REGISTRATION'
    | 'ACCOUNTING_BOOKS'
    | 'OTHER'
    | undefined
  name: string
  documentId: string
  issuedBy: string
  dateOfIssue: Date | undefined
  dateOfExpiry: Date | undefined
}
