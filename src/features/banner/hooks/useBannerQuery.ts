import { useQuery } from '@tanstack/react-query'

import { getActiveBannersByType } from '../api/bannerApi'
import type { Banner, BannerType } from '../types/banner.type'

/**
 * 타입별 배너 조회 Query Hook
 * @param type 배너 타입 (BIG, SMALL, TEXT)
 */
export function useBannersByTypeQuery(type: BannerType) {
    return useQuery<Banner[]>({
        queryKey: ['banners', type],
        queryFn: () => getActiveBannersByType(type),
        staleTime: 1000 * 60 * 5, // 5분
    })
}
