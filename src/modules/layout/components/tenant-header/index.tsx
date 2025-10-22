import { getTenantCachedGlobal } from '@/utilities/getTenantGlobals'
import React from 'react'

import type { Header, Tenant } from '../../../../../payload-types'
import { HeaderClient } from './HeaderClient'

interface TenantHeaderProps {
  tenant: Tenant | null
}

export async function TenantHeader({ tenant }: TenantHeaderProps) {
  if (!tenant) return null

  const tenantId = tenant?.id
  const headerData = (await getTenantCachedGlobal('header', 1, tenantId)()) as Header

  return <HeaderClient tenant={tenant} data={headerData} />
}

