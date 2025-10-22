import type { Config } from '../../payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = 'header' | 'footer' | 'pages' | 'products' | 'media'

async function getGlobal(collection: Global, depth = 0, tenantId: number) {
  const payload = await getPayload({ config: configPromise })

  if (!tenantId) return null

  const { docs } = await payload.find({
    collection: collection as any,
    where: { tenant: { equals: tenantId } },
    depth,
    limit: 1,
  })

  return docs[0] || null
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 * Cache key includes tenantId to ensure proper tenant isolation
 */
export const getTenantCachedGlobal = (collection: Global, depth = 0, tenantId: number) =>
  unstable_cache(async () => getGlobal(collection, depth, tenantId), [String(collection), String(tenantId)], {
    tags: [`global_${String(collection)}`, `tenant_${String(tenantId)}`],
  })
