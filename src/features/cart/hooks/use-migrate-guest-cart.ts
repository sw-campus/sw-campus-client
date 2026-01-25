'use client'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { addCartLecture, getCartItems } from '@/features/cart/api/cart.api'
import { cartLecturesQueryKey } from '@/features/cart/hooks/use-cart-lectures-query'
import { useGuestCartStore } from '@/store/guest-cart.store'

const MAX_SERVER_CART_ITEMS = 10

/**
 * Guest Cart 마이그레이션 훅
 *
 * 로그인 성공 후 호출하여 localStorage의 guest cart 아이템들을
 * 서버 cart로 마이그레이션합니다.
 *
 * 마이그레이션 로직:
 * 1. localStorage cart 확인
 * 2. 서버 cart 조회
 * 3. 서버에 없는 항목만 필터링
 * 4. 10개 제한 내에서 서버에 추가
 * 5. Toast: "담아둔 N개 강의가 저장되었습니다"
 * 6. localStorage cart 비우기
 */
export function useMigrateGuestCart() {
  const queryClient = useQueryClient()
  const clearGuestCart = useGuestCartStore(state => state.clear)

  const migrateGuestCart = async () => {
    // 1. guest cart가 비어있으면 종료
    // 함수 호출 시점의 최신 상태를 가져옴 (stale closure 방지)
    const guestItems = useGuestCartStore.getState().items
    if (guestItems.length === 0) return

    try {
      // 2. 현재 서버 cart 조회
      const serverItems = await getCartItems()
      const serverLectureIds = new Set(serverItems.map(item => item.lectureId))

      // 3. 서버에 없는 항목만 필터링
      const itemsToMigrate = guestItems.filter(
        item => !serverLectureIds.has(item.lectureId),
      )

      if (itemsToMigrate.length === 0) {
        // 모두 중복이면 guest cart만 비우고 종료
        clearGuestCart()
        return
      }

      // 4. 10개 제한 내에서 추가 가능한 개수 계산
      const availableSlots = MAX_SERVER_CART_ITEMS - serverItems.length
      const itemsToAdd = itemsToMigrate.slice(0, availableSlots)

      // 서버에 순차적으로 추가 (batch API 없음)
      let addedCount = 0
      for (const item of itemsToAdd) {
        try {
          await addCartLecture(item.lectureId)
          addedCount++
        } catch {
          // 개별 추가 실패는 무시 (중복 등)
        }
      }

      // 5. 성공 메시지 표시
      if (addedCount > 0) {
        toast.success(`담아둔 ${addedCount}개 강의가 저장되었습니다`)
      }

      // 추가하지 못한 항목이 있는 경우 알림
      const notAdded = itemsToMigrate.length - addedCount
      if (notAdded > 0 && availableSlots < itemsToMigrate.length) {
        toast.info(`${notAdded}개 강의는 최대 개수 초과로 저장되지 않았습니다`)
      }

      // 6. guest cart 비우기
      clearGuestCart()

      // 서버 cart 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: cartLecturesQueryKey })
    } catch (error) {
      console.error('Guest cart migration failed:', error)
      // 마이그레이션 실패해도 guest cart는 유지
    }
  }

  return { migrateGuestCart }
}
