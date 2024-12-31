export const ProofTypeService = {
  getData() {
    return [
      { name: 'Document prooving person name', code: 'PERSON_NAME' },
      { name: 'Document prooving person birth', code: 'PERSON_BIRTH' },
      { name: "Person's Government ID", code: 'PERSON_GOVID' },
      { name: 'Document prooving company registration', code: 'COMPANY_REGISTRATION' },
      { name: 'Document prooving tax registration', code: 'COMPANY_TAX_ID' },
      { name: 'Document prooving residency', code: 'RESIDENCY_ADDRESS' },
      { name: 'Financial statements', code: 'FINANCIAL_STATEMENTS' },
      {
        name: 'Document prooving institution registrato for prof trader registration',
        code: 'PROFESSIONAL_TRADER_REGISTRATION'
      }
    ]
  },

  getFileTypes() {
    return Promise.resolve(this.getData())
  }
}
