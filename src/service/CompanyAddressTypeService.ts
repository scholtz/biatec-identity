export const CompanyAddressTypeService = {
  getData() {
    return [
      { name: 'Legal seat', code: 'LEGAL_SEAT' },
      { name: 'Branch address', code: 'BRANCH' },
      { name: 'Other', code: 'OTHER' }
    ]
  },

  getCompanyAddressTypes() {
    return Promise.resolve(this.getData())
  }
}
