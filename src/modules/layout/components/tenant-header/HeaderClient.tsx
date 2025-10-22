'use client'
import Link from 'next/link'
import React from 'react'
import type { Header, Tenant } from '../../../../../payload-types'
import { Logo } from '@modules/common/components/logo'
import { CMSLink } from '@modules/common/components/cms-link'

interface HeaderClientProps {
  tenant: Tenant
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ tenant, data }) => {
  const navItems = data?.navItems || []

  return (
    <div className="bg-ui-bg-subtle border-b border-ui-border-base py-4">
      <div className="content-container flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo tenant={tenant} loading="eager" priority="high" />
        </Link>
        
        {navItems.length > 0 && (
          <nav className="flex gap-6 items-center">
            {navItems.map(({ link }, i) => {
              return <CMSLink key={i} {...link} appearance="link" />
            })}
          </nav>
        )}
      </div>
    </div>
  )
}

