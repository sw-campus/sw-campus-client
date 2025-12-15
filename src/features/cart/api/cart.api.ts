import type { CartItem } from '@/features/cart/types/cart.type'
import { api } from '@/lib/axios'

type AnyRecord = Record<string, unknown>
type LectureId = string | number

const CART_ENDPOINT = '/carts'

function toCartItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as AnyRecord

  const lecture = (r.lecture && typeof r.lecture === 'object' ? (r.lecture as AnyRecord) : null) ?? null

  const lectureId = String((r.lectureId ?? r.id ?? lecture?.id ?? '') as unknown)
  if (!lectureId || lectureId === 'undefined' || lectureId === 'null') return null

  const title = String((r.title ?? r.lectureTitle ?? r.name ?? lecture?.title ?? '') as unknown)

  const thumbnailCandidate = (r.thumbnailUrl ??
    r.imageUrl ??
    r.image ??
    lecture?.thumbnailUrl ??
    lecture?.imageUrl) as unknown
  const thumbnailUrl = typeof thumbnailCandidate === 'string' ? thumbnailCandidate : undefined

  return {
    lectureId,
    title: title || lectureId,
    thumbnailUrl,
  }
}

export async function getCartItems(): Promise<CartItem[]> {
  const res = await api.get(CART_ENDPOINT, {
    validateStatus: status => status === 200 || status === 401,
  })

  if (res.status === 401) return []

  const data = res.data
  const items =
    data && typeof data === 'object' && Array.isArray((data as AnyRecord).items)
      ? ((data as AnyRecord).items as unknown[])
      : null
  const list = Array.isArray(data) ? data : (items ?? [])

  return (list as unknown[]).map(toCartItem).filter(Boolean) as CartItem[]
}

export async function addCartLecture(lectureId: LectureId): Promise<void> {
  await api.post(CART_ENDPOINT, null, {
    params: { lectureId },
  })
}

export async function removeCartLecture(lectureId: LectureId): Promise<void> {
  await api.delete(CART_ENDPOINT, {
    params: { lectureId },
  })
}
