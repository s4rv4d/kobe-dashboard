'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { resolveIpfs } from '@/lib/utils/format'
import type { Nft } from '@/types'

interface NftCardProps {
  nft: Nft
}

export function NftCard({ nft }: NftCardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <Card className="overflow-hidden p-0">
      <div className="aspect-square relative bg-muted">
        {!imgError && nft.imageUrl ? (
          <Image
            src={resolveIpfs(nft.imageUrl)}
            alt={nft.name}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <div className="font-medium truncate">{nft.name}</div>
        <div className="text-sm text-muted-foreground truncate">
          {nft.collection.name}
        </div>
        {nft.floorPriceEth && (
          <div className="text-sm mt-1">
            Floor: {nft.floorPriceEth.toFixed(2)} ETH
          </div>
        )}
      </CardContent>
    </Card>
  )
}
