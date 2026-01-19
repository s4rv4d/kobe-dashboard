import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { Portfolio, TokensResponse, NftsResponse, SafeInfo } from '@/types'

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS || ''

export function useSafeInfo(address: string = VAULT_ADDRESS) {
  return useQuery({
    queryKey: ['safe', address],
    queryFn: () => apiClient<SafeInfo>(`/safe/${address}`),
    enabled: !!address,
    staleTime: 60_000,
  })
}

export function usePortfolio(address: string = VAULT_ADDRESS) {
  return useQuery({
    queryKey: ['portfolio', address],
    queryFn: () => apiClient<Portfolio>(`/safe/${address}/portfolio`),
    enabled: !!address,
    staleTime: 30_000,
    refetchInterval: 30_000,
  })
}

export function useTokens(address: string = VAULT_ADDRESS) {
  return useQuery({
    queryKey: ['tokens', address],
    queryFn: () => apiClient<TokensResponse>(`/safe/${address}/tokens`),
    enabled: !!address,
    staleTime: 30_000,
  })
}

export function useNfts(address: string = VAULT_ADDRESS, limit: number = 50) {
  return useQuery({
    queryKey: ['nfts', address, limit],
    queryFn: () =>
      apiClient<NftsResponse>(`/safe/${address}/nfts?limit=${limit}`),
    enabled: !!address,
    staleTime: 60_000,
  })
}
