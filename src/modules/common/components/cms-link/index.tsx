import { Button } from '@medusajs/ui'
import { clx } from '@medusajs/ui'
import Link from 'next/link'
import React from 'react'

import type { Page } from '../../../../../payload-types'

type CMSLinkType = {
  appearance?: 'inline' | 'default' | 'outline' | 'link'
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages'
    value: Page | string | number
  } | null
  size?: 'small' | 'base' | 'large' | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    url,
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `/${reference.value.slug}`
      : url

  if (!href) return null

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={clx(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  if (appearance === 'link') {
    return (
      <Link 
        className={clx('hover:text-ui-fg-base', className)} 
        href={href || url || ''} 
        {...newTabProps}
      >
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} variant={appearance === 'outline' ? 'secondary' : 'primary'}>
      <Link className={clx(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}

