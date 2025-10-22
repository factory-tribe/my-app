'use client'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@modules/common/components/cms-link'
import { Logo } from '@modules/common/components/logo'

import type { Tenant, Footer } from '../../../../../payload-types'

interface FooterClientProps {
  tenant: Tenant
  data: Footer
}

export const FooterClient: React.FC<FooterClientProps> = ({ tenant, data }) => {
  const navItems = data?.navItems || []

  return (
    <footer className="mt-auto border-t border-ui-border-base bg-ui-bg-base">
      <div className="content-container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo tenant={tenant} loading="lazy" priority="low" />
        </Link>

        {navItems.length > 0 && (
          <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
            <nav className="flex flex-col md:flex-row gap-4">
              {navItems.map(({ link }, i) => {
                return <CMSLink className="text-ui-fg-subtle hover:text-ui-fg-base" key={i} {...link} appearance="link" />
              })}
            </nav>
          </div>
        )}
      </div>
    </footer>
  )
}

