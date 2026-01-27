'use client'

import { useQueries } from '@tanstack/react-query'

import { useCartLecturesQuery } from '@/features/cart/hooks/use-cart-lectures-query'
import type { CartItem } from '@/features/cart/types/cart.type'
import { getLectureDetail } from '@/features/lecture/api/lecture-api'
import { useAuthStore } from '@/store/auth-store'
import { useGuestCartStore } from '@/store/guest-cart.store'

const EMPTY_CART_ITEMS: CartItem[] = []

/**
 * 통합 Cart 훅 - 로그인 여부에 따라 서버/로컬 cart 자동 분기
 *
 * - 로그인 상태: 서버 API에서 cart 조회
 * - 비로그인 상태: localStorage (guest cart)에서 조회
 */
export function useUnifiedCart() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const hasAuthHydrated = useAuthStore(state => state.hasHydrated)

  const guestItems = useGuestCartStore(state => state.items)
  const hasGuestHydrated = useGuestCartStore(state => state.hasHydrated)

  // 서버 cart 조회 (로그인 시에만 활성화)
  const serverCartQuery = useCartLecturesQuery()

  // hydration 완료 여부
  // - 로그인 사용자: auth hydration만 필요 (서버 cart 사용)
  // - 비로그인 사용자: guest cart hydration도 필요 (localStorage 사용)
  const hasHydrated = isLoggedIn ? hasAuthHydrated : (hasAuthHydrated && hasGuestHydrated)

  // 로그인 상태에 따른 기본 아이템 선택
  const baseItems: CartItem[] = isLoggedIn
    ? (serverCartQuery.data ?? EMPTY_CART_ITEMS)
    : guestItems

  // 상세 정보가 부족한 아이템들의 lectureId 추출
  const lectureIdsNeedingDetail = Array.from(
    new Set(
      baseItems
        .filter(item => !item.categoryName || !item.orgName || !item.title || !item.thumbnailUrl)
        .map(item => item.lectureId),
    ),
  )

  // 상세 정보 조회 쿼리들
  // 로그인 시: 서버 쿼리 성공 후에만 활성화 (기존 동작 유지)
  // 비로그인 시: hydration 완료 후 활성화
  const detailQueriesEnabled = isLoggedIn
    ? serverCartQuery.isSuccess && baseItems.length > 0
    : hasHydrated && baseItems.length > 0

  const detailQueries = useQueries({
    queries: lectureIdsNeedingDetail.map(lectureId => ({
      queryKey: ['lectureDetail', lectureId],
      queryFn: () => getLectureDetail(lectureId),
      enabled: detailQueriesEnabled,
      staleTime: 1000 * 60,
    })),
  })

  // 상세 정보 매핑
  const detailByLectureId = new Map<
    string,
    { title?: string; orgName?: string; thumbnailUrl?: string; categoryName?: string }
  >()

  for (const q of detailQueries) {
    if (!q.data) continue
    detailByLectureId.set(q.data.id, {
      title: q.data.title,
      orgName: q.data.orgName,
      thumbnailUrl: q.data.thumbnailUrl,
      categoryName: q.data.categoryName,
    })
  }

  // 디버깅: 상세 정보 조회 상태
  console.log('[useUnifiedCart] isLoggedIn:', isLoggedIn)
  console.log('[useUnifiedCart] baseItems:', JSON.stringify(baseItems, null, 2))
  console.log('[useUnifiedCart] lectureIdsNeedingDetail:', lectureIdsNeedingDetail)
  console.log('[useUnifiedCart] detailQueries count:', detailQueries.length)
  console.log('[useUnifiedCart] detailByLectureId:', Array.from(detailByLectureId.entries()))

  // 상세 정보로 보강된 아이템 목록
  const enrichedItems = baseItems.map(item => {
    const detail = detailByLectureId.get(item.lectureId)
    return {
      ...item,
      title: item.title || detail?.title || item.lectureId,
      orgName: item.orgName || detail?.orgName,
      categoryName: item.categoryName || detail?.categoryName,
      thumbnailUrl: item.thumbnailUrl || detail?.thumbnailUrl,
    }
  })

  console.log('[useUnifiedCart] enrichedItems:', JSON.stringify(enrichedItems, null, 2))

  // 로딩 상태 계산
  const isLoading = !hasHydrated || (isLoggedIn && serverCartQuery.isLoading)
  const isError = isLoggedIn && serverCartQuery.isError

  return {
    items: enrichedItems,
    isLoading,
    isError,
    isLoggedIn,
    hasHydrated,
  }
}
