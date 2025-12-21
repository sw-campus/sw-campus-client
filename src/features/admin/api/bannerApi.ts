import { api } from '@/lib/axios'

import type { Banner, BannerPeriodStatus, CreateBannerRequest } from '../types/banner.type'

/**
 * 배너 검색 응답 타입 (Spring Data Page)
 */
export interface BannerPageResponse {
  content: Banner[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

/**
 * 배너 검색 파라미터
 */
export interface BannerSearchParams {
  keyword?: string
  periodStatus?: BannerPeriodStatus
  page?: number
  size?: number
}

/**
 * 배너 목록 조회 API (검색 및 페이징)
 */
export async function fetchBanners(params?: BannerSearchParams): Promise<BannerPageResponse> {
  const searchParams = new URLSearchParams()

  if (params?.keyword) {
    searchParams.append('keyword', params.keyword)
  }
  if (params?.periodStatus && params.periodStatus !== 'ALL') {
    searchParams.append('periodStatus', params.periodStatus)
  }
  if (params?.page !== undefined) {
    searchParams.append('page', params.page.toString())
  }
  if (params?.size !== undefined) {
    searchParams.append('size', params.size.toString())
  }

  const queryString = searchParams.toString()
  const url = queryString ? `/admin/banners?${queryString}` : '/admin/banners'

  const { data } = await api.get<BannerPageResponse>(url)
  return data
}

/**
 * 배너 생성 API (이미지 파일 업로드 지원)
 * @param request - 배너 생성 요청
 * @param imageFile - 배너 이미지 파일 (선택)
 * @returns 생성된 배너 정보
 */
export async function createBanner(request: CreateBannerRequest, imageFile?: File): Promise<Banner> {
  const formData = new FormData()
  formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }))

  if (imageFile) {
    formData.append('image', imageFile)
  }

  const { data } = await api.post<Banner>('/admin/banners', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

/**
 * 배너 활성화/비활성화 토글 API
 * @param id - 배너 ID
 * @param isActive - 활성화 여부
 * @returns 업데이트된 배너 정보
 */
export async function toggleBannerActive(id: number, isActive: boolean): Promise<Banner> {
  const { data } = await api.patch<Banner>(`/admin/banners/${id}/active`, { isActive })
  return data
}

/**
 * 배너 수정 API (이미지 파일 업로드 지원)
 * @param id - 배너 ID
 * @param request - 배너 수정 요청
 * @param imageFile - 배너 이미지 파일 (선택)
 * @returns 수정된 배너 정보
 */
export async function updateBanner(id: number, request: CreateBannerRequest, imageFile?: File): Promise<Banner> {
  const formData = new FormData()
  formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }))

  if (imageFile) {
    formData.append('image', imageFile)
  }

  const { data } = await api.put<Banner>(`/admin/banners/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

/**
 * 배너 삭제 API
 * @param id - 배너 ID
 */
export async function deleteBanner(id: number): Promise<void> {
  await api.delete(`/admin/banners/${id}`)
}
