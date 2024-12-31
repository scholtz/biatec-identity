import type { IAddressMap } from './IAddressMap'
import type { ICompanyAddressMap } from './ICompanyAddressMap'
import type { ICompanyDiscordMap } from './ICompanyDiscordMap'
import type { ICompanyEmailMap } from './ICompanyEmailMap'
import type { ICompanyMap } from './ICompanyMap'
import type { ICompanyPeopleMap } from './ICompanyPeopleMap'
import type { ICompanyPhoneMap } from './ICompanyPhoneMap'
import type { ICompanyTelegramMap } from './ICompanyTelegramMap'
import type { ICompanyXAccountMap } from './ICompanyXAccountMap'
import type { IDiscordMap } from './IDiscordMap'
import type { IDocumentFileMap } from './IDocumentFileMap'
import type { IDocumentMap } from './IDocumentMap'
import type { IFileMap } from './IFileMap'
import type { IPersonAddressMap } from './IPersonAddressMap'
import type { IPersonDiscordMap } from './IPersonDiscordMap'
import type { IPersonEmailMap } from './IPersonEmailMap'
import type { IPersonMap } from './IPersonMap'
import type { IPersonPhoneMap } from './IPersonPhoneMap'
import type { IPersonTelegramMap } from './IPersonTelegramMap'
import type { IPersonXAccountMap } from './IPersonXAccountMap'
import type { IPhoneMap } from './IPhoneMap'
import type { IProofMap } from './IProofMap'
import type { ITelegramMap } from './ITelegramMap'
import type { IXAccountMap } from './IXAccountMap'

export interface KYCInput {
  verificationClaim: '' | 'PERSON' | 'LEGAL_ENTITY' | 'PROFESSIONAL_TRADER'
  people: IPersonMap
  companies: ICompanyMap
  addresses: IAddressMap
  phones: IPhoneMap
  xAccounts: IXAccountMap
  discordAccounts: IDiscordMap
  telegramAccounts: ITelegramMap
  files: IFileMap
  documents: IDocumentMap
  documentsFiles: IDocumentFileMap
  proofs: IProofMap

  personAddresses: IPersonAddressMap
  personEmails: IPersonEmailMap
  personPhones: IPersonPhoneMap
  personXAccounts: IPersonXAccountMap
  personDiscordAccounts: IPersonDiscordMap
  personTelegramAccounts: IPersonTelegramMap

  companyAddresses: ICompanyAddressMap
  companyEmails: ICompanyEmailMap
  companyPhones: ICompanyPhoneMap
  companyXAccounts: ICompanyXAccountMap
  companyDiscordAccounts: ICompanyDiscordMap
  companyTelegramAccounts: ICompanyTelegramMap
  companyPeople: ICompanyPeopleMap
  note: string
}
