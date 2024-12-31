export const FileTypeService = {
  getData() {
    return [
      { name: 'Front side', code: 'FRONT' },
      { name: 'Back side', code: 'BACK' },
      { name: 'Full document', code: 'FULL' },
      { name: 'Partial file', code: 'PARTIAL' },
      { name: 'Other', code: 'OTHER' }
    ]
  },

  getFileTypes() {
    return Promise.resolve(this.getData())
  }
}
