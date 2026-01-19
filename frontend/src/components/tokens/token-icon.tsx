'use client'

import { useState } from 'react'
import Image from 'next/image'
import { resolveIpfs } from '@/lib/utils/format'

interface TokenIconProps {
  symbol: string
  logoUrl?: string
  size?: number
}

export function TokenIcon({ symbol, logoUrl, size = 40 }: TokenIconProps) {
  const [imgError, setImgError] = useState(false)
  const resolvedUrl = resolveIpfs(logoUrl)

  if (!resolvedUrl || imgError) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 font-mono text-xs font-medium text-amber-400"
        style={{ width: size, height: size }}
      >
        {symbol.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    <div
      className="relative rounded-full overflow-hidden ring-1 ring-white/10"
      style={{ width: size, height: size }}
    >
      <Image
        src={resolvedUrl}
        alt={symbol}
        fill
        className="object-cover"
        onError={() => setImgError(true)}
      />
    </div>
  )
}
