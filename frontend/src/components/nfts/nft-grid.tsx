import { NftCard } from './nft-card'
import type { Nft } from '@/types'
import { ImageOff } from 'lucide-react'

interface NftGridProps {
  nfts: Nft[]
}

export function NftGrid({ nfts }: NftGridProps) {
  if (nfts.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
        <ImageOff className="h-10 w-10 opacity-50" />
        <span className="text-sm">No NFTs found in this vault</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 stagger-children">
      {nfts.map((nft) => (
        <NftCard key={`${nft.contractAddress}-${nft.tokenId}`} nft={nft} />
      ))}
    </div>
  )
}
