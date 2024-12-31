import type { IDocument } from '@/interface/IDocument'

export const documentFormatter = (document: IDocument) => {
  return `${document.name}`.trim()
}
