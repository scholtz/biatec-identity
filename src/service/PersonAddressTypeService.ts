export const PersonAddressTypeService = {
  getData() {
    return [
      { name: 'Residential address', code: 'RESIDENTIAL' },
      { name: 'Pernament address', code: 'PERNAMENT' },
      { name: 'Temporary address', code: 'TEMPORARY' },
      { name: 'Other', code: 'OTHER' }
    ]
  },

  getPersonAddressTypes() {
    return Promise.resolve(this.getData())
  }
}
