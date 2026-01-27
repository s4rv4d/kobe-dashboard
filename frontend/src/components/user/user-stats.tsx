"use client"

import { DollarSign, Wallet, TrendingUp, Percent } from "lucide-react"
import { StatCard } from "@/components/stats/stat-card"
import { formatUSD } from "@/lib/utils/format"

interface UserStatsProps {
  totalInvested: number
  currentValue?: number
  multiple?: number
  xirr?: number
}

function formatMultiple(value: number): string {
  return `${value.toFixed(2)}x`
}

function formatXirr(value: number): string {
  const percentage = value * 100
  const sign = percentage >= 0 ? "+" : ""
  return `${sign}${percentage.toFixed(1)}%`
}

export function UserStats({
  totalInvested,
  currentValue,
  multiple,
  xirr,
}: UserStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
      <StatCard
        title="Total Invested"
        value={formatUSD(totalInvested)}
        icon={Wallet}
      />
      <StatCard
        title="Current Value"
        value={currentValue != null ? formatUSD(currentValue) : "—"}
        icon={DollarSign}
      />
      <StatCard
        title="Multiple"
        value={multiple != null ? formatMultiple(multiple) : "—"}
        variant={
          multiple != null
            ? multiple >= 1
              ? "positive"
              : "negative"
            : "default"
        }
        icon={TrendingUp}
      />
      <StatCard
        title="XIRR"
        value={xirr != null ? formatXirr(xirr) : "—"}
        variant={
          xirr != null ? (xirr >= 0 ? "positive" : "negative") : "default"
        }
        icon={Percent}
      />
    </div>
  )
}
