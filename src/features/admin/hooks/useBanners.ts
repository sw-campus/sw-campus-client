import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { BannerPageResponse, BannerSearchParams } from '../api/bannerApi'
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
 * 낙관적 업데이트를 사용하여 순서 유지
 */
export function useToggleBannerActiveMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => toggleBannerActive(id, isActive),
    onMutate: async ({ id, isActive }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['admin', 'banners'] })

      // 모든 banners 쿼리의 캐시를 업데이트
      queryClient.setQueriesData<BannerPageResponse>({ queryKey: ['admin', 'banners'] }, oldData => {
        if (!oldData) return oldData
        return {
          ...oldData,
          content: oldData.content.map(banner => (banner.id === id ? { ...banner, isActive } : banner)),
        }
      })
    },
    onSuccess: (_data, variables) => {
      toast.success(variables.isActive ? '배너가 활성화되었습니다.' : '배너가 비활성화되었습니다.')
    },
    onError: () => {
      // 에러 시 쿼리 다시 fetch
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] })
      toast.error('배너 상태 변경에 실패했습니다.')
    },
  })
}
