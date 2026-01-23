import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  apiClient,
  apiClientPut,
  apiClientDelete,
  apiClientUpload,
} from '@/lib/api/client'
import type {
  UserProfile,
  UserProfileUpdate,
  TwitterAuthResponse,
} from '@/types'

export function useUserProfile(address: string | undefined) {
  return useQuery({
    queryKey: ['userProfile', address],
    queryFn: () => apiClient<UserProfile | null>(`/user/${address}`),
    enabled: !!address,
    staleTime: 60_000,
  })
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UserProfileUpdate) =>
      apiClientPut<UserProfile>('/user/me', data),
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile', data.address], data)
    },
  })
}

export function useUploadProfilePhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) =>
      apiClientUpload<UserProfile>('/user/me/photo', file),
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile', data.address], data)
    },
  })
}

export function useDeleteProfilePhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiClientDelete<UserProfile>('/user/me/photo'),
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile', data.address], data)
    },
  })
}

export function useTwitterAuth() {
  return useMutation({
    mutationFn: async (redirectUri: string) => {
      const response = await apiClient<TwitterAuthResponse>(
        `/user/twitter/auth?redirect_uri=${encodeURIComponent(redirectUri)}`
      )
      return response.authUrl
    },
  })
}

export function useDisconnectTwitter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiClientDelete<null>('/user/twitter'),
    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
    },
  })
}
