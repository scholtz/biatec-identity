export interface IFile {
  type: 'FRONT' | 'BACK' | 'FULL' | 'PARTIAL' | 'OTHER' | undefined
  name: string
  fileId: string
  note: string
}
