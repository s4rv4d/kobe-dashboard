'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { resolveIpfs } from '@/lib/utils/format'

interface TokenIconProps {
  symbol: string
  logoUrl?: string
  size?: number
}

export function TokenIcon({ symbol, logoUrl, size = 32 }: TokenIconProps) {
  const [imgError, setImgError] = useState(false)
  const resolvedUrl = resolveIpfs(logoUrl)

  if (!resolvedUrl || imgError) {
    return (
      <Avatar style={{ width: size, height: size }}>
        <AvatarFallback className="text-xs">
          {symbol.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    )
  }

  return (
    <Image
      src={resolvedUrl}
      alt={symbol}
      width={size}
      height={size}
      className="rounded-full"
      onError={() => setImgError(true)}
    />
  )
}
