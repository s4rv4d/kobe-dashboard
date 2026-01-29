'use client'

import { useState } from 'react'
import { NftCard } from './nft-card'
import type { Nft } from '@/types'
import { ImageOff, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NftGridProps {
  nfts: Nft[]
}

const ITEMS_PER_PAGE = 10 // 2 rows x 5 cols

export function NftGrid({ nfts }: NftGridProps) {
  const [page, setPage] = useState(0)

  const totalPages = Math.ceil(nfts.length / ITEMS_PER_PAGE)
  const startIndex = page * ITEMS_PER_PAGE
  const paginatedNfts = nfts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  if (nfts.length === 0) {
    return (
      <div className="solid-card flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
        <ImageOff className="h-10 w-10 opacity-50" />
        <span className="text-sm">No NFTs found in this vault</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Fixed height grid container - 2 rows */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 min-h-[420px]">
        {paginatedNfts.map((nft) => (
          <NftCard key={`${nft.contractAddress}-${nft.tokenId}`} nft={nft} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>

          <span className="text-sm text-muted-foreground">
            {page + 1} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
