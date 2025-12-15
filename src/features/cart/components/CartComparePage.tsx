'use client'

import { useMemo, useState } from 'react'

import Image from 'next/image'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart.store'

type Side = 'left' | 'right'

const DND_MIME = 'application/x-sw-campus-lecture-id'

function setDragLectureId(e: React.DragEvent, lectureId: string) {
  e.dataTransfer.setData(DND_MIME, lectureId)
  e.dataTransfer.setData('text/plain', lectureId)
  e.dataTransfer.effectAllowed = 'copy'
}

function getDragLectureId(e: React.DragEvent) {
  return e.dataTransfer.getData(DND_MIME) || e.dataTransfer.getData('text/plain')
}

function DropZone({
  side,
  title,
  selectedTitle,
  onDropLecture,
}: {
  side: Side
  title: string
  selectedTitle?: string
  onDropLecture: (side: Side, lectureId: string) => void
}) {
  const [isOver, setIsOver] = useState(false)

  return (
    <div
      className={cn(
        'border-border flex items-center justify-between rounded-md border border-dashed px-3 py-2 text-sm',
        isOver && 'bg-muted/50',
      )}
      onDragEnter={e => {
        e.preventDefault()
        setIsOver(true)
      }}
      onDragLeave={() => setIsOver(false)}
      onDragOver={e => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
      }}
      onDrop={e => {
        e.preventDefault()
        setIsOver(false)
        const lectureId = getDragLectureId(e)
        if (!lectureId) return
        onDropLecture(side, lectureId)
      }}
      aria-label={`${title} 드롭 영역`}
    >
      <div className="font-medium">{title}</div>
      <div className="text-muted-foreground max-w-[55%] truncate text-right">
        {selectedTitle ? selectedTitle : '여기에 드래그'}
      </div>
    </div>
  )
}

export default function CartComparePage() {
  const items = useCartStore(s => s.items)

  const [leftId, setLeftId] = useState<string | null>(null)
  const [rightId, setRightId] = useState<string | null>(null)

  const left = useMemo(() => items.find(i => i.id === leftId) ?? null, [items, leftId])
  const right = useMemo(() => items.find(i => i.id === rightId) ?? null, [items, rightId])

  const onDropLecture = (side: Side, lectureId: string) => {
    if (side === 'left') setLeftId(lectureId)
    else setRightId(lectureId)
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-6 md:grid-cols-[280px_1fr]">
      <aside className="space-y-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">장바구니</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {items.length === 0 ? (
              <div className="text-muted-foreground text-sm">장바구니가 비어있습니다.</div>
            ) : (
              items.map(item => (
                <button
                  key={item.id}
                  type="button"
                  draggable
                  onDragStart={e => setDragLectureId(e, item.id)}
                  onClick={() => {
                    if (!leftId) setLeftId(item.id)
                    else if (!rightId) setRightId(item.id)
                    else setLeftId(item.id)
                  }}
                  className="hover:bg-muted/50 border-border flex w-full items-center gap-3 rounded-md border p-2 text-left"
                >
                  <div className="bg-muted relative h-10 w-10 overflow-hidden rounded-md">
                    {item.image ? <Image src={item.image} alt="" fill sizes="40px" className="object-cover" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{item.title}</div>
                    <div className="text-muted-foreground truncate text-xs">{item.id}</div>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </aside>

      <main className="space-y-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">비교</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2 md:grid-cols-2">
              <DropZone side="left" title="왼쪽" selectedTitle={left?.title} onDropLecture={onDropLecture} />
              <DropZone side="right" title="오른쪽" selectedTitle={right?.title} onDropLecture={onDropLecture} />
            </div>

            <div className="border-border rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px]">항목</TableHead>
                    <TableHead>왼쪽</TableHead>
                    <TableHead>오른쪽</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">강의명</TableCell>
                    <TableCell className={cn(!left && 'text-muted-foreground')}>{left?.title ?? '미선택'}</TableCell>
                    <TableCell className={cn(!right && 'text-muted-foreground')}>{right?.title ?? '미선택'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">ID</TableCell>
                    <TableCell className={cn(!left && 'text-muted-foreground')}>{left?.id ?? '미선택'}</TableCell>
                    <TableCell className={cn(!right && 'text-muted-foreground')}>{right?.id ?? '미선택'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="text-muted-foreground text-xs">
              사이드바에서 강의를 드래그해서 왼쪽/오른쪽 영역에 놓으면 비교표가 업데이트됩니다.
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
