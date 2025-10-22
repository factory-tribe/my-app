import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

export async function getRedirects(depth = 1, tenantDomain?: string) {
  const payload = await getPayload({ config: configPromise })

  // Build where clause for tenant filtering
  const whereClause: any = {}
  
  if (tenantDomain) {
    whereClause['tenant.domain'] = { equals: tenantDomain }
  }

  const { docs: redirects } = await payload.find({
    collection: 'redirects',
    depth,
    limit: 0,
    pagination: false,
    where: whereClause,
  })

  return redirects
}

/**
 * Returns a unstable_cache function mapped with the cache tag for 'redirects'.
 *
 * Cache all redirects together to avoid multiple fetches.
 */
export const getCachedRedirects = (tenantDomain?: string) =>
  unstable_cache(
    async () => getRedirects(1, tenantDomain), 
    ['redirects', tenantDomain || 'all'], 
    {
      tags: ['redirects'],
    }
  )
