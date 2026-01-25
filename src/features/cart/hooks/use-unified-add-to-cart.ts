'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { addCartLecture } from '@/features/cart/api/cart.api'
import { cartLecturesQueryKey } from '@/features/cart/hooks/use-cart-lectures-query'
import type { AddToCartItem, CartItem } from '@/features/cart/types/cart.type'
import { getLectureDetail } from '@/features/lecture/api/lecture-api'
import { useAuthStore } from '@/store/auth-store'
import { useGuestCartStore } from '@/store/guest-cart.store'

/**
 * 통합 Add to Cart 훅 - 로그인 여부에 따라 서버/로컬 cart에 자동 추가
 *
 * - 로그인 상태: 서버 API 호출
 * - 비로그인 상태: localStorage (guest cart)에 저장
 */
export function useUnifiedAddToCart() {
  const queryClient = useQueryClient()
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const addGuestItem = useGuestCartStore(state => state.addItem)

  // 서버 cart에 추가하는 mutation (로그인 시)
  const serverMutation = useMutation({
    mutationFn: (lectureId: string) => addCartLecture(lectureId),
    onMutate: async lectureId => {
      await queryClient.cancelQueries({ queryKey: cartLecturesQueryKey })
      const previous = queryClient.getQueryData<CartItem[]>(cartLecturesQueryKey)

      queryClient.setQueryData<CartItem[]>(cartLecturesQueryKey, old => {
        const next = old ? [...old] : []
        if (next.some(i => String(i.lectureId) === String(lectureId))) return next
        next.push({ lectureId: String(lectureId), title: String(lectureId) })
        return next
      })

      return { previous }
    },
    onError: (_err, _lectureId, ctx) => {
      if (!ctx?.previous) return
      queryClient.setQueryData(cartLecturesQueryKey, ctx.previous)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartLecturesQueryKey })
    },
  })

  /**
   * Cart에 아이템 추가
   * - 서버 에러(409 Conflict)는 axios 인터셉터에서 처리
   * - 로컬 중복/제한은 여기서 토스트 표시
   */
  const addToCart = async (item: AddToCartItem) => {
    const lectureId = String(item.lectureId)

    if (isLoggedIn) {
      // 로그인 상태: 서버 API 호출
      serverMutation.mutate(lectureId)
    } else {
      // 비로그인 상태: guest cart에 추가
      // 먼저 강의 상세 정보 조회하여 풍부한 CartItem 생성
      try {
        const detail = await getLectureDetail(lectureId)
        const cartItem: CartItem = {
          lectureId,
          title: detail.title,
          categoryName: detail.categoryName,
          orgName: detail.orgName,
          thumbnailUrl: detail.thumbnailUrl,
        }

        const result = addGuestItem(cartItem)

        if (!result.success) {
          if (result.reason === 'duplicate') {
            toast.info('이미 AI 심층 비교 목록에 있는 강의입니다')
          } else if (result.reason === 'limit') {
            toast.warning('AI 심층 비교는 최대 10개까지 담을 수 있습니다')
          }
        }
      } catch {
        // 상세 정보 조회 실패 시 기본 정보만으로 추가
        const cartItem: CartItem = {
          lectureId,
          title: lectureId,
        }

        const result = addGuestItem(cartItem)

        if (!result.success) {
          if (result.reason === 'duplicate') {
            toast.info('이미 AI 심층 비교 목록에 있는 강의입니다')
          } else if (result.reason === 'limit') {
            toast.warning('AI 심층 비교는 최대 10개까지 담을 수 있습니다')
          }
        }
      }
    }
  }

  return {
    addToCart,
    isPending: serverMutation.isPending,
  }
}
