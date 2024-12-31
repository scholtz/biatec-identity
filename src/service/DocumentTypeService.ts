export const DocumentTypeService = {
  getData() {
    return [
      { name: 'Government ID', code: 'GOV_ID' },
      { name: 'Driving license', code: 'DRIVING_LICENSE' },
      { name: 'Passport', code: 'PASSPORT' },
      { name: 'Bank statement', code: 'BANK_STATEMENT' },
      { name: 'Phone bill', code: 'PHONE_BILL' },
      { name: 'Extract from the commercial register', code: 'TRADE_REGISTRY_DOC' },
      { name: 'Tax registration document', code: 'TAX_REGISTRATION_DOC' },
      {
        name: 'Professional trader registration document',
        code: 'PROFESSIONAL_TRADER_REGISTRATION'
      },
      { name: 'Financial statements', code: 'ACCOUNTING_BOOKS' },
      { name: 'Other', code: 'OTHER' }
    ]
  },

  getDocumentTypes() {
    return Promise.resolve(this.getData())
  }
}
