import { api } from '@/lib/axios'
import type { PageResponse } from '@/types/api.type'

import type { MemberRole, MemberSummary } from '../types/member.type'

/**
 * 회원 목록 조회 API (페이징)
 * @param role - 회원 역할 필터 (undefined면 전체)
 * @param keyword - 검색 키워드 (이름, 닉네임, 이메일)
 * @param page - 페이지 번호 (0-indexed)
 * @param size - 페이지 크기
 */
export async function fetchMembers(
  keyword?: string,
  page: number = 0,
  size: number = 10,
): Promise<PageResponse<MemberSummary>> {
  const { data } = await api.get<PageResponse<MemberSummary>>('/admin/members', {
    params: {
      ...(keyword && { keyword }),
      page,
      size,
    },
  })
  return data
}
