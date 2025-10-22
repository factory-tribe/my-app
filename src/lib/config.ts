import "server-only"
import Medusa from "@medusajs/js-sdk"
import { cookies as nextCookies, headers as nextHeaders } from "next/headers"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

// Append tenant to all SDK requests using the cookie set by middleware
const originalClientFetch = sdk.client.fetch.bind(sdk.client)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(sdk.client.fetch as any) = async (path: string, init: any = {}) => {
  try {
    // Forward host for backend domain-based seller resolution only
    const hdrs = nextHeaders()
    const incomingHost = (hdrs as any).get("host") || undefined
    if (incomingHost) {
      init.headers = {
        ...(init.headers || {}),
        "x-client-host": incomingHost,
      }
    }
  } catch {
    // best-effort; proceed without tenant if cookies() unavailable
  }

  return originalClientFetch(path, init)
}
