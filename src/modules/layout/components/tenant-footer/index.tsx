import React from 'react'

import { getTenantCachedGlobal } from '@/utilities/getTenantGlobals'
import { FooterClient } from './FooterClient'

import type { Tenant, Footer } from '../../../../../payload-types'

interface TenantFooterProps {
  tenant: Tenant | null
}

export async function TenantFooter({ tenant }: TenantFooterProps) {
  if (!tenant) return null
  
  const tenantId = tenant.id
  const footerData = (await getTenantCachedGlobal('footer', 1, tenantId)()) as Footer

  return <FooterClient tenant={tenant} data={footerData} />
}

