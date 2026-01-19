'use client'

import { useState } from 'react'
import Image from 'next/image'
import { resolveIpfs } from '@/lib/utils/format'
import type { Nft } from '@/types'
import { ImageOff } from 'lucide-react'

interface NftCardProps {
  nft: Nft
}

export function NftCard({ nft }: NftCardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="glass-card overflow-hidden group cursor-pointer">
      {/* Image Container */}
      <div className="aspect-square relative bg-black/20 overflow-hidden">
        {!imgError && nft.imageUrl ? (
          <Image
            src={resolveIpfs(nft.imageUrl)}
            alt={nft.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
            <ImageOff className="h-8 w-8 opacity-50" />
            <span className="text-xs">No Image</span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Floor Price Badge */}
        {nft.floorPriceEth && (
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="glass-card px-2 py-1.5 text-xs font-mono flex items-center justify-between">
              <span className="text-muted-foreground">Floor</span>
              <span className="text-amber-400">{nft.floorPriceEth.toFixed(3)} ETH</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-1">
        <p className="font-medium truncate group-hover:text-amber-400 transition-colors">
          {nft.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {nft.collection.name}
        </p>
      </div>
    </div>
  )
}
