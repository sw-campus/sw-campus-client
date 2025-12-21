import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { BannerSearchParams } from '../api/bannerApi'
import { createBanner, deleteBanner, fetchBanners, toggleBannerActive, updateBanner } from '../api/bannerApi'
import type { CreateBannerRequest } from '../types/banner.type'

/**
 * 배너 목록 조회 Query Hook (검색 및 페이징 지원)
 */
export function useBannersQuery(params?: BannerSearchParams) {
  return useQuery({
    queryKey: ['admin', 'banners', params?.keyword, params?.periodStatus, params?.page, params?.size],
    queryFn: () => fetchBanners(params),
    staleTime: 1000 * 60 * 5, // 5분간 fresh 유지
  })
}

/**
 * 배너 생성 Mutation Hook
 */
export function useCreateBannerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ request, imageFile }: { request: CreateBannerRequest; imageFile?: File }) =>
      createBanner(request, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] })
      toast.success('배너가 생성되었습니다.')
    },
  })
}

/**
 * 배너 수정 Mutation Hook
 */
export function useUpdateBannerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, request, imageFile }: { id: number; request: CreateBannerRequest; imageFile?: File }) =>
      updateBanner(id, request, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] })
      toast.success('배너가 수정되었습니다.')
    },
  })
}

/**
 * 배너 삭제 Mutation Hook
 */
export function useDeleteBannerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] })
      toast.success('배너가 삭제되었습니다.')
    },
  })
}

/**
 * 배너 활성화/비활성화 토글 Mutation Hook
 */
export function useToggleBannerActiveMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => toggleBannerActive(id, isActive),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] })
      toast.success(variables.isActive ? '배너가 활성화되었습니다.' : '배너가 비활성화되었습니다.')
    },
  })
}
