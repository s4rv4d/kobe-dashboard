'use client'

import { VaultStats } from '@/components/stats/vault-stats'
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
import { AlertCircle, PieChart, Coins, Image } from 'lucide-react'

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="glass-card flex items-center gap-3 p-4 border-red-500/20">
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
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
        <Icon className="h-4 w-4 text-amber-400" />
      </div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
    </div>
  )
}

export function DashboardContent() {
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
  const { data: nftsData, isLoading: nftsLoading, error: nftsError } = useNfts()

  return (
    <div className="space-y-10">
      {/* Stats Section */}
      <section className="animate-in">
        <ErrorBoundary>
          {portfolioLoading ? (
            <StatsSkeleton />
          ) : portfolioError ? (
            <ErrorMessage message="Failed to load portfolio stats" />
          ) : portfolio ? (
            <VaultStats
              totalValue={portfolio.totalValueUsd}
              change24h={portfolio.change24h}
              tokenCount={portfolio.tokenCount}
              nftCount={portfolio.nftCount}
            />
          ) : null}
        </ErrorBoundary>
      </section>

      {/* Chart and Token List */}
      <section className="grid lg:grid-cols-[380px_1fr] gap-6 animate-in animate-delay-100">
        <div>
          <SectionHeader icon={PieChart} title="Allocation" />
          <ErrorBoundary>
            {portfolioLoading ? (
              <ChartSkeleton />
            ) : portfolioError ? (
              <ErrorMessage message="Failed to load allocation chart" />
            ) : portfolio ? (
              <TokenPieChart allocation={portfolio.allocation} />
            ) : null}
          </ErrorBoundary>
        </div>

        <div>
          <SectionHeader icon={Coins} title="Holdings" />
          <ErrorBoundary>
            {tokensLoading ? (
              <TokenListSkeleton />
            ) : tokensError ? (
              <ErrorMessage message="Failed to load tokens" />
            ) : tokensData ? (
              <TokenList tokens={tokensData.tokens} />
            ) : null}
          </ErrorBoundary>
        </div>
      </section>

      {/* NFT Section */}
      <section className="animate-in animate-delay-200">
        <SectionHeader icon={Image} title="NFT Collection" />
        <ErrorBoundary>
          {nftsLoading ? (
            <NftGridSkeleton />
          ) : nftsError ? (
            <ErrorMessage message="Failed to load NFTs" />
          ) : nftsData ? (
            <NftGrid nfts={nftsData.nfts} />
          ) : null}
        </ErrorBoundary>
      </section>
    </div>
  )
}
