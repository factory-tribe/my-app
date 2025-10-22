import clsx from 'clsx'
import React from 'react'
import { Tenant, Media } from '../../../../../payload-types'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  tenant?: Tenant | null
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className, tenant } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  const defaultLogo = 'https://drive.google.com/file/d/1OM0pBgSj3mPOpGj_tPtuHOT0Ea9i_vv5/view?usp=drive_link'
  const logo = (tenant?.logo as Media as { url?: string | null })?.url ?? defaultLogo

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt={tenant?.name || 'Store Logo'}
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[9.375rem] w-full h-[34px]', className)}
      src={logo}
    />
  )
}

