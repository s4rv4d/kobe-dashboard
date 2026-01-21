import { DollarSign, Wallet, TrendingUp, Percent } from 'lucide-react'
import { StatCard } from './stat-card'
import { formatUSD } from '@/lib/utils/format'

interface VaultStatsProps {
  currentValue: number
  investedAmount: number
  multiple: number
  xirr: number
}

function formatMultiple(value: number): string {
  return `${value.toFixed(2)}x`
}

function formatXirr(value: number): string {
  const percentage = value * 100
  const sign = percentage >= 0 ? '+' : ''
  return `${sign}${percentage.toFixed(1)}%`
}

export function VaultStats({
  currentValue,
  investedAmount,
  multiple,
  xirr,
}: VaultStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
      <StatCard
        title="Current Value"
        value={formatUSD(currentValue)}
        icon={DollarSign}
      />
      <StatCard
        title="Invested"
        value={formatUSD(investedAmount)}
        icon={Wallet}
      />
      <StatCard
        title="Multiple"
        value={formatMultiple(multiple)}
        variant={multiple >= 1 ? 'positive' : 'negative'}
        icon={TrendingUp}
      />
      <StatCard
        title="XIRR"
        value={formatXirr(xirr)}
        variant={xirr >= 0 ? 'positive' : 'negative'}
        icon={Percent}
      />
    </div>
  )
}
