/**
 * Google Analytics 이벤트 추적 유틸리티
 */

// gtag 타입 선언
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * GA 이벤트 전송 함수
 */
function sendEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

/**
 * 배너 클릭 이벤트 추적
 */
export function trackBannerClick(params: {
  bannerId: number
  bannerType: 'BIG' | 'MIDDLE' | 'SMALL'
  bannerName: string
  lectureId?: number
  url?: string | null
}) {
  sendEvent('banner_click', {
    banner_id: params.bannerId,
    banner_type: params.bannerType,
    banner_name: params.bannerName,
    lecture_id: params.lectureId,
    destination_url: params.url || `/lectures/${params.lectureId}`,
  })
}

/**
 * 신청 버튼 클릭 이벤트 추적
 */
export function trackApplyButtonClick(params: {
  lectureId: number | string
  lectureName: string
  orgName: string
  url: string
}) {
  sendEvent('apply_button_click', {
    lecture_id: params.lectureId,
    lecture_name: params.lectureName,
    org_name: params.orgName,
    destination_url: params.url,
  })
}

/**
 * 장바구니 추가 이벤트 추적
 */
export function trackAddToCart(params: { lectureId: number | string; lectureName?: string }) {
  sendEvent('add_to_cart', {
    lecture_id: params.lectureId,
    lecture_name: params.lectureName,
  })
}

/**
 * 공유하기 버튼 클릭 이벤트 추적
 */
export function trackShare(params: {
  lectureId: number | string
  lectureName: string
  method: 'clipboard' | 'native'
}) {
  sendEvent('share', {
    lecture_id: params.lectureId,
    lecture_name: params.lectureName,
    method: params.method,
  })
}

/**
 * 검색 이벤트 추적 (인기 검색어 분석용)
 */
export function trackSearch(searchTerm: string) {
  if (searchTerm.trim()) {
    sendEvent('search', {
      search_term: searchTerm.trim(),
    })
  }
}
