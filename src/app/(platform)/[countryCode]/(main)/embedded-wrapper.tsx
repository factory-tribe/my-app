'use client'

import { useSearchParams } from 'next/navigation'
import { ReactNode } from 'react'

export function EmbeddedWrapper({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const isEmbedded = searchParams.get('embedded') === 'true'

  if (isEmbedded) {
    return null
  }

  return <>{children}</>
}

