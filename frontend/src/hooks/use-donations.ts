import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { DonationsResponse } from '@/types'

export function useDonations(address: string) {
  return useQuery({
    queryKey: ['donations', address.toLowerCase()],
    queryFn: () => apiClient<DonationsResponse>(`/donations/${address}`),
    staleTime: 60_000,
    enabled: !!address,
  })
}
