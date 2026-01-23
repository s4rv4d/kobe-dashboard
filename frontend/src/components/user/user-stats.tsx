"use client"

import { formatUSD } from "@/lib/utils/format"
import type { Donation } from "@/types"

interface UserStatsProps {
  donations: Donation[]
  total: number
}

export function UserStats({ donations, total }: UserStatsProps) {
  const totalDonated = donations.reduce((sum, d) => sum + d.usdDonateValue, 0)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
        <p className="text-sm text-muted-foreground mb-1">Total Donated</p>
        <p className="text-2xl font-semibold font-mono text-amber-400">
          {formatUSD(totalDonated)}
        </p>
      </div>
      <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
        <p className="text-sm text-muted-foreground mb-1">Transactions</p>
        <p className="text-2xl font-semibold font-mono">{total}</p>
      </div>
    </div>
  )
}
