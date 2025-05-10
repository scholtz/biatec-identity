import type { IProof } from '@/interface/IProof'
import { enumFormatter } from './enumFormatter'
import { documentFormatter } from './documentFormatter'
import { useAppStore } from '@/stores/app'
export const proofFormatter = (proof: IProof) => {
  const store = useAppStore()
  const doc = store.state.userInput.documents[proof.documentId]
  const docText = doc ? documentFormatter(doc) : ''
  if (proof.note) {
    return `${enumFormatter('PROOF_TYPE', proof.proofType)} - ${docText} - ${proof.note}`.trim()
  }
  return `${enumFormatter('PROOF_TYPE', proof.proofType)} - ${docText}`.trim()
}
