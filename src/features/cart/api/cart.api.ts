import type { CartItem } from '@/features/cart/types/cart.type'
import { api } from '@/lib/axios'

type AnyRecord = Record<string, unknown>
type LectureId = string | number

const CART_ENDPOINT = '/carts'

function toRecord(value: unknown): AnyRecord | null {
  return value && typeof value === 'object' ? (value as AnyRecord) : null
}

function pickString(...candidates: unknown[]): string | undefined {
  for (const candidate of candidates) {
    if (typeof candidate === 'string') {
      const trimmed = candidate.trim()
      if (trimmed) return trimmed
    }
  }
  return undefined
}

function toCartItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as AnyRecord

  const lecture = toRecord(r.lecture)
  const org = toRecord(r.org) ?? toRecord(r.organization) ?? toRecord(r.organisation) ?? null
  const lectureOrg =
    (lecture
      ? (toRecord(lecture.org) ?? toRecord(lecture.organization) ?? toRecord(lecture.organisation) ?? null)
      : null) ?? null

  const lectureId = String((r.lectureId ?? r.id ?? lecture?.id ?? '') as unknown)
  if (!lectureId || lectureId === 'undefined' || lectureId === 'null') return null

  const titleCandidate =
    r.title ?? r.lectureName ?? r.lectureTitle ?? r.name ?? lecture?.lectureName ?? lecture?.title ?? lecture?.name
  const title = pickString(titleCandidate) ?? String(titleCandidate ?? '')

  const orgName = pickString(
    r.orgName,
    r.organizationName,
    r.organisationName,
    org?.orgName,
    org?.organizationName,
    org?.name,
    org?.title,
    lecture?.orgName,
    lecture?.organizationName,
    lecture?.organisationName,
    lectureOrg?.orgName,
    lectureOrg?.organizationName,
    lectureOrg?.name,
    lectureOrg?.title,
  )

  const categoryName = pickString(
    r.categoryName,
    r.category,
    r.categoryTitle,
    lecture?.categoryName,
    lecture?.category,
    lecture?.categoryTitle,
  )

  const thumbnailCandidate = (r.thumbnailUrl ??
    r.lecture_image_url ??
    r.lectureImageUrl ??
    r.imageUrl ??
    r.image_url ??
    r.image ??
    lecture?.thumbnailUrl ??
    lecture?.lecture_image_url ??
    lecture?.lectureImageUrl ??
    lecture?.imageUrl ??
    lecture?.image_url) as unknown
  const thumbnailUrl = typeof thumbnailCandidate === 'string' ? thumbnailCandidate : undefined

  return {
    lectureId,
    title: title || lectureId,
    categoryName,
    orgName,
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
