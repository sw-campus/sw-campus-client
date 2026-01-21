import { api } from '@/lib/axios'

import type { Banner, BannerType } from '../types/banner.type'

/**
 * 타입별 활성화된 배너 목록 조회
 * @param type 배너 타입 (BIG, SMALL, TEXT)
 * @returns 배너 목록
 */
export async function getActiveBannersByType(type: BannerType): Promise<Banner[]> {
    const { data } = await api.get<Banner[]>(`/banners/type/${type}`)
    return data
}
