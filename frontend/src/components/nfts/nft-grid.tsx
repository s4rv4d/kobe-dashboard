import { NftCard } from './nft-card'
import type { Nft } from '@/types'

interface NftGridProps {
  nfts: Nft[]
}

export function NftGrid({ nfts }: NftGridProps) {
  if (nfts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No NFTs found
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {nfts.map((nft) => (
        <NftCard key={`${nft.contractAddress}-${nft.tokenId}`} nft={nft} />
      ))}
    </div>
  )
}
