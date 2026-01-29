'use client'

import { VaultStats } from '@/components/stats/vault-stats'
import { ContributorsList } from '@/components/contributors/contributors-list'
import {
  StatsSkeleton,
  ContributorsListSkeleton,
} from '@/components/skeletons'
import { ErrorBoundary } from '@/components/error-boundary'
import { useVaultStats, useContributions } from '@/hooks/use-vault'
import { AlertCircle, Users } from 'lucide-react'

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

export function DashboardContent() {
  const {
    data: vaultStats,
    isLoading: statsLoading,
    error: statsError,
  } = useVaultStats()
  const {
    data: contributionsData,
    isLoading: contributionsLoading,
    error: contributionsError,
  } = useContributions()

  return (
    <div className="space-y-10">
      {/* Stats Section */}
      <section className="animate-in">
        <ErrorBoundary>
          {statsLoading ? (
            <StatsSkeleton />
          ) : statsError ? (
            <ErrorMessage message="Failed to load vault stats" />
          ) : vaultStats ? (
            <VaultStats
              currentValue={vaultStats.currentValue}
              investedAmount={vaultStats.investedAmount}
              multiple={vaultStats.multiple}
              xirr={vaultStats.xirr}
            />
          ) : null}
        </ErrorBoundary>
      </section>

      {/* Contributors Section */}
      <section className="animate-in animate-delay-100">
        <SectionHeader icon={Users} title="Contributors" />
        <ErrorBoundary>
          {contributionsLoading ? (
            <ContributorsListSkeleton />
          ) : contributionsError ? (
            <ErrorMessage message="Failed to load contributors" />
          ) : contributionsData ? (
            <ContributorsList contributors={contributionsData.contributors} />
          ) : null}
        </ErrorBoundary>
      </section>
    </div>
  )
}
