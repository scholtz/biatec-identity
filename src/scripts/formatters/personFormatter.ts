import type { IPerson } from '@/interface/IPerson'

export const personFormatter = (person: IPerson) => {
  return `${person.titleBefore} ${person.firstName} ${person.middleName} ${person.lastName} ${person.titleAfter}`.trim()
}
