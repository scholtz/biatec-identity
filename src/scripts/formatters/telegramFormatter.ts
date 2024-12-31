import type { ITelegram } from '@/interface/ITelegram'

export const telegramFormatter = (telegram: ITelegram) => {
  return `${telegram.telegramAccount}`.trim()
}
