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
import { AlertCircle } from 'lucide-react'

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-destructive p-4 bg-destructive/10 rounded-lg">
      <AlertCircle className="h-5 w-5" />
      <span>{message}</span>
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
    <div className="space-y-8">
      {/* Stats Section */}
      <section>
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
      <section className="grid md:grid-cols-[1fr_2fr] gap-6">
        <ErrorBoundary>
          {portfolioLoading ? (
            <ChartSkeleton />
          ) : portfolioError ? (
            <ErrorMessage message="Failed to load allocation chart" />
          ) : portfolio ? (
            <TokenPieChart allocation={portfolio.allocation} />
          ) : null}
        </ErrorBoundary>

        <ErrorBoundary>
          {tokensLoading ? (
            <TokenListSkeleton />
          ) : tokensError ? (
            <ErrorMessage message="Failed to load tokens" />
          ) : tokensData ? (
            <TokenList tokens={tokensData.tokens} />
          ) : null}
        </ErrorBoundary>
      </section>

      {/* NFT Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">NFT Collection</h2>
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
