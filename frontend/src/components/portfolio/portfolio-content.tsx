'use client'

import { StatCard } from '@/components/stats/stat-card'
import { TokenPieChart } from '@/components/charts/token-pie-chart'
import { TokenList } from '@/components/tokens/token-list'
import { NftGrid } from '@/components/nfts/nft-grid'
import {
  StatsSkeleton,
  ChartSkeleton,
  TokenListSkeleton,
  NftGridSkeleton,
} from '@/components/skeletons'
import { ErrorBoundary } from '@/components/error-boundary'
import { usePortfolio, useTokens, useNfts } from '@/hooks/use-portfolio'
import { formatUSD } from '@/lib/utils/format'
import {
  DollarSign,
  TrendingUp,
  Coins,
  ImageIcon,
  PieChart,
  AlertCircle,
} from 'lucide-react'

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="solid-card flex items-center gap-3 p-4 border-red-500/20">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
        <AlertCircle className="h-4 w-4 text-red-400" />
      </div>
      <span className="text-sm text-red-400">{message}</span>
    </div>
  )
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType
  title: string
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff5f1f]/10">
        <Icon className="h-4 w-4 text-[#ff5f1f]" />
      </div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
    </div>
  )
}

function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function PortfolioContent() {
  const {
    data: portfolio,
    isLoading: portfolioLoading,
    error: portfolioError,
  } = usePortfolio()
  const {
    data: tokensData,
    isLoading: tokensLoading,
    error: tokensError,
  } = useTokens()
  const {
    data: nftsData,
    isLoading: nftsLoading,
    error: nftsError,
  } = useNfts()

  return (
    <div className="space-y-10">
      {/* Portfolio Stats */}
      <section className="animate-in">
        <ErrorBoundary>
          {portfolioLoading ? (
            <StatsSkeleton />
          ) : portfolioError ? (
            <ErrorMessage message="Failed to load portfolio" />
          ) : portfolio ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
              <StatCard
                title="Total Value"
                value={formatUSD(portfolio.totalValueUsd)}
                icon={DollarSign}
              />
              <StatCard
                title="24H Change"
                value={formatChange(portfolio.change24h)}
                variant={portfolio.change24h >= 0 ? 'positive' : 'negative'}
                icon={TrendingUp}
              />
              <StatCard
                title="Tokens"
                value={portfolio.tokenCount}
                icon={Coins}
              />
              <StatCard
                title="NFTs"
                value={portfolio.nftCount}
                icon={ImageIcon}
              />
            </div>
          ) : null}
        </ErrorBoundary>
      </section>

      {/* Allocation + Holdings */}
      <section className="animate-in animate-delay-100">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
          {/* Allocation Chart */}
          <div>
            <SectionHeader icon={PieChart} title="Allocation" />
            <ErrorBoundary>
              {portfolioLoading ? (
                <ChartSkeleton />
              ) : portfolioError ? (
                <ErrorMessage message="Failed to load allocation" />
              ) : portfolio?.allocation?.length ? (
                <TokenPieChart allocation={portfolio.allocation} />
              ) : (
                <div className="solid-card p-8 text-center text-muted-foreground text-sm">
                  No allocation data
                </div>
              )}
            </ErrorBoundary>
          </div>

          {/* Holdings (Token List) */}
          <div>
            <SectionHeader icon={Coins} title="Holdings" />
            <ErrorBoundary>
              {tokensLoading ? (
                <TokenListSkeleton />
              ) : tokensError ? (
                <ErrorMessage message="Failed to load tokens" />
              ) : tokensData?.tokens?.length ? (
                <TokenList tokens={tokensData.tokens} />
              ) : (
                <div className="solid-card p-8 text-center text-muted-foreground text-sm">
                  No tokens found
                </div>
              )}
            </ErrorBoundary>
          </div>
        </div>
      </section>

      {/* NFTs */}
      <section className="animate-in animate-delay-200">
        <SectionHeader icon={ImageIcon} title="NFTs" />
        <ErrorBoundary>
          {nftsLoading ? (
            <NftGridSkeleton />
          ) : nftsError ? (
            <ErrorMessage message="Failed to load NFTs" />
          ) : nftsData?.nfts ? (
            <NftGrid nfts={nftsData.nfts} />
          ) : null}
        </ErrorBoundary>
      </section>
    </div>
  )
}
