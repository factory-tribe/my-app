import type React from 'react'
import type { Page, Post } from '@/payload-types'

import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, redirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
  tenantDomain?: string
}

/**
 * Normalizes a URL to just the pathname for comparison
 * Handles both full URLs (https://domain.com/path) and paths (/path)
 */
function normalizeUrlForComparison(url: string): string {
  try {
    // If it's a full URL, parse it and get the pathname
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const urlObj = new URL(url)
      return urlObj.pathname
    }
    // Otherwise, return as-is (it's already a path)
    return url
  } catch (e) {
    // If URL parsing fails, return as-is
    return url
  }
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url, tenantDomain }) => {
  const redirects = await getCachedRedirects(tenantDomain)()

  // Normalize both the current URL and redirect.from for comparison
  const normalizedUrl = normalizeUrlForComparison(url)
  const redirectItem = redirects.find((redirect) => {
    const normalizedFrom = normalizeUrlForComparison(redirect.from)
    return normalizedFrom === normalizedUrl
  })

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url)
    }

    let redirectUrl: string

    if (typeof redirectItem.to?.reference?.value === 'string') {
      const collection = redirectItem.to?.reference?.relationTo
      const id = redirectItem.to?.reference?.value

      const document = (await getCachedDocument(collection, id)()) as Page | Post
      redirectUrl = `${redirectItem.to?.reference?.relationTo !== 'pages' ? `/${redirectItem.to?.reference?.relationTo}` : ''}/${
        document?.slug
      }`
    } else {
      redirectUrl = `${redirectItem.to?.reference?.relationTo !== 'pages' ? `/${redirectItem.to?.reference?.relationTo}` : ''}/${
        typeof redirectItem.to?.reference?.value === 'object'
          ? redirectItem.to?.reference?.value?.slug
          : ''
      }`
    }

    if (redirectUrl) redirect(redirectUrl)
  }

  if (disableNotFound) return null

  notFound()
}
