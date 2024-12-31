export const CompanyRelationTypeService = {
  getData() {
    return [
      { name: 'Director/CEO', code: 'CEO' },
      { name: 'COO', code: 'COO' },
      { name: 'CTO', code: 'CTO' },
      { name: 'CFO', code: 'CFO' },
      { name: 'Company Lawyer', code: 'LAWYER' },
      { name: 'Employee', code: 'EMPLOYEE' },
      { name: 'Other', code: 'OTHER' }
    ]
  },

  getFileTypes() {
    return Promise.resolve(this.getData())
  }
}
