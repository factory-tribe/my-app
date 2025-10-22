import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

export async function getDocument(collection: string, id: string, depth = 1) {
  const payload = await getPayload({ config: configPromise })

  const doc = await payload.findByID({
    collection: collection as any,
    id,
    depth,
  })

  return doc
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the document.
 */
export const getCachedDocument = (collection: string, id: string) =>
  unstable_cache(async () => getDocument(collection, id), [`${collection}-${id}`], {
    tags: [`${collection}-${id}`],
  })
