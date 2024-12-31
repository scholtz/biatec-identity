import type { IDiscord } from '@/interface/IDiscord'

export const discordFormatter = (discord: IDiscord) => {
  return `${discord.discordName}`.trim()
}
