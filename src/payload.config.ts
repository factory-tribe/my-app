// Import polyfills first to ensure they're loaded before any other code
import "./polyfills"

import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { buildConfig } from "payload"
import { DefaultLogger, ConsoleLogWriter } from "drizzle-orm"
import { Users } from "./collections/Users"
import { Products } from "./collections/Products"
import { Media } from "./collections/Media"
import { Tenants } from "./collections/Tenants"
import { Header } from "./collections/Header/config"
import { Footer } from "./collections/Footer/config"
import { Pages } from "./collections/Pages/index"
import { plugins } from "./plugins"

// Import sharp conditionally
// In Cloudflare Workers, sharp is not needed at runtime (only during build)
let sharp: any = undefined
try {
  // Only import sharp if we're not in a Workers environment
  if (typeof process !== 'undefined' && !globalThis.navigator?.userAgent?.includes('Cloudflare-Workers')) {
    sharp = require('sharp')
  }
} catch (e) {
  // Sharp not available or failed to load - this is OK for Workers runtime
}

// Function to get database connection string from Hyperdrive or fallback to env var
function getDatabaseConnectionString(): string {
  // Try to access Cloudflare context for Hyperdrive
  try {
    const cloudflareContext = (globalThis as any)[Symbol.for('__cloudflare-context__')]
    if (cloudflareContext?.env?.HYPERDRIVE?.connectionString) {
      return cloudflareContext.env.HYPERDRIVE.connectionString
    }
  } catch (e) {
    // Cloudflare context not available (probably during build or local dev)
  }
  
  // Fallback to environment variable
  return process.env.PAYLOAD_DATABASE_URL || ""
}

export default buildConfig({
  editor: lexicalEditor(),
  collections: [
    Users,
    Products,
    Media,
    Tenants,
    Header,
    Footer,
    Pages,
  ],

  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    logger: new DefaultLogger({ writer: new ConsoleLogWriter() }),
    pool: {
      connectionString: getDatabaseConnectionString(),
      maxUses: 1,
    },
  }),
  sharp,
  
  plugins,
})

//TODO