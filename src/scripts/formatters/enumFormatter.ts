import { DocumentTypeService } from '@/service/DocumentTypeService'
import { PersonAddressTypeService } from '@/service/PersonAddressTypeService'
import { CompanyAddressTypeService } from '@/service/CompanyAddressTypeService'
import { CompanyRelationTypeService } from '@/service/CompanyRelationTypeService'
import { ProofTypeService } from '@/service/ProofTypeService'

export const enumFormatter = (
  enumCode:
    | 'DOCUMENT_TYPE'
    | 'PERSON_ADDRESS_TYPE'
    | 'COMPANY_ADDRESS_TYPE'
    | 'COMPANY_RELATION_TYPE'
    | 'PROOF_TYPE',
  obj: string | undefined
) => {
  if (enumCode == 'DOCUMENT_TYPE') {
    const data = DocumentTypeService.getData()
    return data.find((d) => d.code == obj)?.name
  }
  if (enumCode == 'PERSON_ADDRESS_TYPE') {
    const data = PersonAddressTypeService.getData()
    return data.find((d) => d.code == obj)?.name
  }
  if (enumCode == 'COMPANY_ADDRESS_TYPE') {
    const data = CompanyAddressTypeService.getData()
    return data.find((d) => d.code == obj)?.name
  }
  if (enumCode == 'COMPANY_RELATION_TYPE') {
    const data = CompanyRelationTypeService.getData()
    return data.find((d) => d.code == obj)?.name
  }
  if (enumCode == 'PROOF_TYPE') {
    const data = ProofTypeService.getData()
    return data.find((d) => d.code == obj)?.name
  }
  throw new Error(`Enum code ${enumCode} not implemented`)
}
