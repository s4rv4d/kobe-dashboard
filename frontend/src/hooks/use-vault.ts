import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { VaultStats, ContributionsResponse } from '@/types'

export function useVaultStats() {
  return useQuery({
    queryKey: ['vault', 'stats'],
    queryFn: () => apiClient<VaultStats>('/vault/stats'),
    staleTime: 30_000,
    refetchInterval: 30_000,
  })
}

export function useContributions() {
  return useQuery({
    queryKey: ['vault', 'contributions'],
    queryFn: () => apiClient<ContributionsResponse>('/vault/contributions'),
    staleTime: 60_000,
  })
}
