import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
// @ts-ignore
import { RichText } from '@payloadcms/richtext-lexical/react'
import { normalizeDomain } from '@/utilities/normalizeDomain'
import { PayloadRedirects } from '@/components/PayloadRedirects'

export async function generateStaticParams() {
    try {
        const payload = await getPayload({ config: configPromise })

  const tenants = await payload.find({
    collection: 'tenants',
    limit: 1000,
    pagination: false,
  })

  if (!tenants?.docs || tenants.docs.length === 0) {
    return []
  }

  const params = await Promise.all(
    tenants.docs
      .filter((tenant) => tenant?.domain && typeof tenant.domain === 'string')
      .map(async (tenant) => {
        try {
          const pages = await payload.find({
            collection: 'pages',
            draft: false,
            depth: 0,
            limit: 1000,
            pagination: false,
            select: { slug: true },
            where: { 'tenant.id': { equals: tenant.id } },
          })

          if (!pages?.docs) {
            return []
          }

          return pages.docs
            .filter((page) => page?.slug && typeof page.slug === 'string' && page.slug.trim() !== '')
            .map((page) => ({
              slug: String(page.slug),
            }))
        } catch (error) {
          console.error(`Error fetching pages for tenant ${tenant.domain}:`, error)
          return []
        }
      }),
  )
  

  return params.flat()
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return []
  }
}

type Args = {
  params: Promise<{ slug: string }>
}

export default async function TenantPage({ params }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  
  // Get full host domain for tenant lookup
  const { headers } = await import('next/headers')
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const tenantDomain = normalizeDomain(host)

  const pageSlug = slug || 'home'

  // Check for redirects first - this will handle the redirect if one exists
  const currentUrl = `/${pageSlug}`
  await PayloadRedirects({ url: currentUrl, disableNotFound: true, tenantDomain })

  let page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({
    tenantDomain,
    slug: pageSlug,
  })

  if (!page) {
    return notFound()
  }

  return (
    <article className="py-12">
      <div className="content-container max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{page.title}</h1>
        {page.content && (
          <div className="prose prose-lg max-w-none">
            <RichText data={page.content} />
          </div>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const pageSlug = slug || 'home'
  
  // Get full host domain for tenant lookup
  const { headers } = await import('next/headers')
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const tenantDomain = normalizeDomain(host)

  const page = await queryPageBySlug({ tenantDomain, slug: pageSlug })

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    }
  }

  return {
    title: page.title || 'Page',
    description: page.title || 'Page content',
  }
}

const queryPageBySlug = cache(
  async ({ tenantDomain, slug }: { tenantDomain: string; slug: string }) => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      where: {
        and: [{ slug: { equals: slug } }, { 'tenant.domain': { equals: tenantDomain } }],
      },
    })

    return result.docs?.[0] || null
  },
)

