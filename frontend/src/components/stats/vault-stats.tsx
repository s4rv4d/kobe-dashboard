import { DollarSign, TrendingUp, Coins, Image } from 'lucide-react'
import { StatCard } from './stat-card'
import { formatUSD } from '@/lib/utils/format'

interface VaultStatsProps {
  totalValue: number
  change24h: number
  tokenCount: number
  nftCount: number
}

export function VaultStats({
  totalValue,
  change24h,
  tokenCount,
  nftCount,
}: VaultStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
      <StatCard
        title="Total Value"
        value={formatUSD(totalValue)}
        icon={DollarSign}
      />
      <StatCard
        title="24h Change"
        value={`${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%`}
        variant={change24h >= 0 ? 'positive' : 'negative'}
        icon={TrendingUp}
      />
      <StatCard title="Tokens" value={tokenCount} icon={Coins} />
      <StatCard title="NFTs" value={nftCount} icon={Image} />
    </div>
  )
}
