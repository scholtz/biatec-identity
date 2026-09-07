import createClient from 'openapi-fetch'
import type { paths } from './gateway-schema'
import { useAppStore } from '@/stores/app'

/**
 * Typed client for the Biatec Identity Gateway, generated from
 * src/api/gateway-swagger.json (see `pnpm run generate:gateway-client`).
 *
 * Create a fresh client per request so the current gateway URL and
 * ARC-0014 authorization header from the store are always used.
 */
export const getGatewayClient = () => {
  const store = useAppStore()
  return createClient<paths>({
    baseUrl: store.state.fileGateway,
    headers: { Authorization: store.state.authState.arc14Header }
  })
}
