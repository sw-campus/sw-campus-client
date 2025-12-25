'use client'

import { useEffect } from 'react'

import { useCartLecturesWithDetailQuery } from '@/features/cart/hooks/useCartLecturesWithDetailQuery'
import type { CartItem } from '@/features/cart/types/cart.type'
import { useLectureDetailQuery } from '@/features/lecture'
import type { LectureDetail } from '@/features/lecture/api/lectureApi.types'
import { useOrganizationDetailQuery } from '@/features/organization'
import { useCartCompareStore } from '@/store/cartCompare.store'

type Side = 'left' | 'right'

type Resolved = {
  items: CartItem[]
  isLoading: boolean
  isError: boolean

  leftId: string | null
  rightId: string | null
  setLeftId: (id: string | null) => void
  setRightId: (id: string | null) => void

  left: CartItem | null
  right: CartItem | null

  leftDetail: LectureDetail | null | undefined
  rightDetail: LectureDetail | null | undefined

  leftOrgName: string | undefined
  rightOrgName: string | undefined

  leftDetailResolved: LectureDetail | null | undefined
  rightDetailResolved: LectureDetail | null | undefined

  lockedCategory: string | null
  canUseItem: (itemCategory: string | undefined) => boolean
  isAlreadySelected: (lectureId: string) => boolean

  pickFromList: (lectureId: string) => void
  dropLecture: (side: Side, lectureId: string) => void
}

const EMPTY_CART_ITEMS: CartItem[] = []

export function useCartComparePageModel(): Resolved {
  const cartQuery = useCartLecturesWithDetailQuery()
  const items = cartQuery.data ?? EMPTY_CART_ITEMS

  const { leftId, rightId, setLeftId, setRightId } = useCartCompareStore()

  useEffect(() => {
    if (leftId && !items.some(i => i.lectureId === leftId)) setLeftId(null)
    if (rightId && !items.some(i => i.lectureId === rightId)) setRightId(null)
  }, [items, leftId, rightId, setLeftId, setRightId])

  const itemById = new Map<string, CartItem>()
  for (const item of items) itemById.set(item.lectureId, item)

  const left = (leftId ? itemById.get(leftId) : null) ?? null
  const right = (rightId ? itemById.get(rightId) : null) ?? null

  const { data: leftDetail } = useLectureDetailQuery(leftId)
  const { data: rightDetail } = useLectureDetailQuery(rightId)

  const { data: leftOrg } = useOrganizationDetailQuery(leftDetail?.orgId ?? 0)
  const { data: rightOrg } = useOrganizationDetailQuery(rightDetail?.orgId ?? 0)

  const leftOrgName = leftOrg?.name ?? leftDetail?.orgName ?? left?.orgName
  const rightOrgName = rightOrg?.name ?? rightDetail?.orgName ?? right?.orgName

  const leftDetailResolved = leftDetail ? { ...leftDetail, orgName: leftOrgName ?? leftDetail.orgName } : leftDetail
  const rightDetailResolved = rightDetail
    ? { ...rightDetail, orgName: rightOrgName ?? rightDetail.orgName }
    : rightDetail

  const leftCategory = left?.categoryName ?? leftDetail?.categoryName
  const rightCategory = right?.categoryName ?? rightDetail?.categoryName
  const lockedCategory = leftCategory ?? rightCategory ?? null

  const canUseItem = (itemCategory: string | undefined) => {
    if (!lockedCategory) return true
    if (!itemCategory) return false
    return itemCategory === lockedCategory
  }

  const isAlreadySelected = (lectureId: string) => lectureId === leftId || lectureId === rightId

  const pickFromList = (lectureId: string) => {
    if (isAlreadySelected(lectureId)) return

    const dropped = itemById.get(lectureId)
    const droppedCategory = dropped?.categoryName
    if (!canUseItem(droppedCategory)) return

    if (!leftId) setLeftId(lectureId)
    else if (!rightId) setRightId(lectureId)
    else setLeftId(lectureId)
  }

  const dropLecture = (side: Side, lectureId: string) => {
    if (isAlreadySelected(lectureId)) return

    const dropped = itemById.get(lectureId)
    const droppedCategory = dropped?.categoryName
    if (!canUseItem(droppedCategory)) return

    if (side === 'left') setLeftId(lectureId)
    else setRightId(lectureId)
  }

  return {
    items,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,

    leftId,
    rightId,
    setLeftId,
    setRightId,

    left,
    right,

    leftDetail,
    rightDetail,

    leftOrgName,
    rightOrgName,

    leftDetailResolved,
    rightDetailResolved,

    lockedCategory,
    canUseItem,
    isAlreadySelected,

    pickFromList,
    dropLecture,
  }
}
