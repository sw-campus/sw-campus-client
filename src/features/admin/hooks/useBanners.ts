import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { BannerPageResponse, BannerSearchParams } from '../api/bannerApi'
import {
  createBanner,
  deleteBanner,
  fetchBanners,
  fetchBannerStats,
  toggleBannerActive,
  updateBanner,
} from '../api/bannerApi'
import type { CreateBannerRequest } from '../types/banner.type'

/**
 * 배너 통계 조회 Query Hook
 */
export function useBannerStatsQuery() {
  return useQuery({
    queryKey: ['admin', 'banners', 'stats'],
    queryFn: fetchBannerStats,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * 배너 목록 조회 Query Hook (검색 및 페이징 지원)
 */
export function useBannersQuery(params?: BannerSearchParams) {
  return useQuery({
    queryKey: ['admin', 'banners', params],
    queryFn: () => fetchBanners(params),
    staleTime: 1000 * 60 * 5,
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
 * 낙관적 업데이트로 순서 유지
 */
export function useToggleBannerActiveMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      return await toggleBannerActive(id, isActive)
    },
    onMutate: async ({ id, isActive }) => {
      try {
        // 이전 데이터 저장
        const previousData = queryClient.getQueriesData<BannerPageResponse>({ queryKey: ['admin', 'banners'] })

        // 캐시 즉시 업데이트 (순서 유지)
        queryClient.setQueriesData<BannerPageResponse>({ queryKey: ['admin', 'banners'] }, oldData => {
          if (!oldData?.content) return oldData
          return {
            ...oldData,
            content: oldData.content.map(banner => (banner.id === id ? { ...banner, isActive } : banner)),
          }
        })

        return { previousData }
      } catch (error) {
        console.error('onMutate error:', error)
        return { previousData: [] }
      }
    },
    onSuccess: (_data, variables) => {
      toast.success(variables.isActive ? '배너가 활성화되었습니다.' : '배너가 비활성화되었습니다.')
    },
    onError: (_error, _variables, context) => {
      // 에러 시 롤백
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          if (data) queryClient.setQueryData(queryKey, data)
        })
      }
      toast.error('배너 상태 변경에 실패했습니다.')
    },
  })
}
