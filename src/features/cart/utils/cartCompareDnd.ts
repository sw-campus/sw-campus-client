import type { DragEvent } from 'react'

export const CART_COMPARE_DND_MIME = 'application/x-sw-campus-lecture-id'

export function setDragLectureId(e: DragEvent, lectureId: string) {
  e.dataTransfer.setData(CART_COMPARE_DND_MIME, lectureId)
  e.dataTransfer.setData('text/plain', lectureId)
  e.dataTransfer.effectAllowed = 'copy'
}

export function getDragLectureId(e: DragEvent) {
  return e.dataTransfer.getData(CART_COMPARE_DND_MIME) || e.dataTransfer.getData('text/plain')
}
