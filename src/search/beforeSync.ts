import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ req, originalDoc, searchDoc }) => {
  const { slug, id, title } = originalDoc

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    slug,
  }

  return modifiedDoc
}

