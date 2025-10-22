import type { Tenant } from '../../payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { normalizeDomain } from './normalizeDomain'

export async function fetchTenantByDomain(domain: string): Promise<Tenant | null> {
  const payload = await getPayload({ config: configPromise })
  const domainClean = normalizeDomain(domain)

  const { docs } = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: domainClean } },
    depth: 1,
    limit: 1,
  })

  return docs[0] || null
}
