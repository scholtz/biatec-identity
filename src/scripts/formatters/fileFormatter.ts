import type { IFile } from '@/interface/IFile'

export const fileFormatter = (file: IFile) => {
  return `${file.name}`.trim()
}
