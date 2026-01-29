"use client";

import { TableRow, TableCell } from '@/components/ui/table'
import { formatUSD } from '@/lib/utils/format'
import type { Contributor } from '@/types'
import { useRouter } from 'next/navigation'

interface ContributorRowProps {
  contributor: Contributor
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function ContributorRow({ contributor }: ContributorRowProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/user/${contributor.address}`)
  }

  return (
    <TableRow
      className="border-b border-[#2a2a2a]/50 hover:bg-white/[0.02] transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <TableCell className="py-4">
        <span className="font-mono text-sm text-muted-foreground">
          {truncateAddress(contributor.address)}
        </span>
      </TableCell>
      <TableCell className="text-right font-mono text-muted-foreground">
        {formatUSD(contributor.investedAmount)}
      </TableCell>
      <TableCell className="text-right font-mono font-medium text-foreground">
        {formatUSD(contributor.currentValue)}
      </TableCell>
      <TableCell className="text-right">
        <span className="inline-flex px-2 py-0.5 rounded-md bg-[#8b7bf7]/10 text-[#8b7bf7] text-xs font-mono">
          {contributor.equityPercent.toFixed(1)}%
        </span>
      </TableCell>
      <TableCell className="text-right">
        <span
          className={`inline-flex px-2 py-0.5 rounded-md text-xs font-mono ${
            contributor.multiple >= 1
              ? 'bg-[#b8f53d]/10 text-[#b8f53d]'
              : 'bg-red-500/10 text-red-400'
          }`}
        >
          {contributor.multiple.toFixed(2)}x
        </span>
      </TableCell>
    </TableRow>
  )
}
