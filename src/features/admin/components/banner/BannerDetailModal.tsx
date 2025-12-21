'use client'

import Image from 'next/image'
import { LuPencil, LuTrash2 } from 'react-icons/lu'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { formatDate } from '@/lib/date'
import { cn } from '@/lib/utils'

import type { Banner } from '../../types/banner.type'
import {
  BANNER_PERIOD_STATUS_COLOR,
  BANNER_PERIOD_STATUS_LABEL,
  BANNER_TYPE_LABEL,
  getBannerPeriodStatus,
} from '../../types/banner.type'

interface BannerDetailModalProps {
  banner: Banner | null
  isOpen: boolean
  onClose: () => void
  onToggle: (id: number, isActive: boolean) => void
  onEdit: (banner: Banner) => void
  onDelete: (id: number) => void
  isToggling: boolean
  isDeleting: boolean
}

export function BannerDetailModal({
  banner,
  isOpen,
  onClose,
  onToggle,
  onEdit,
  onDelete,
  isToggling,
  isDeleting,
}: BannerDetailModalProps) {
  if (!banner) return null

  const periodStatus = getBannerPeriodStatus(banner.startDate, banner.endDate)

  const handleDelete = () => {
    if (confirm('정말로 이 배너를 삭제하시겠습니까?')) {
      onDelete(banner.id)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>배너 상세</DialogTitle>
          <DialogDescription>배너 ID: {banner.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 이미지 */}
          {banner.imageUrl && (
            <div className="relative w-full overflow-hidden rounded-lg border">
              <Image
                src={banner.imageUrl}
                alt={banner.lectureName}
                width={800}
                height={400}
                className="h-auto w-full object-contain"
                unoptimized
              />
            </div>
          )}

          {/* 정보 */}
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-muted-foreground text-sm">강의명</div>
                <div className="text-foreground font-medium">{banner.lectureName}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">배너 타입</div>
                <Badge variant="secondary">{BANNER_TYPE_LABEL[banner.type]}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-muted-foreground text-sm">기간</div>
                <div className="text-foreground">
                  {formatDate(banner.startDate)} ~ {formatDate(banner.endDate)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">기간 상태</div>
                <Badge variant="secondary" className={cn('font-medium', BANNER_PERIOD_STATUS_COLOR[periodStatus])}>
                  {BANNER_PERIOD_STATUS_LABEL[periodStatus]}
                </Badge>
              </div>
            </div>

            {banner.url && (
              <div>
                <div className="text-muted-foreground text-sm">링크 URL</div>
                <a href={banner.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {banner.url}
                </a>
              </div>
            )}

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <div className="text-foreground font-medium">활성화 상태</div>
                <div className="text-muted-foreground text-sm">
                  {banner.isActive ? '배너가 사용자에게 표시됩니다' : '배너가 숨겨져 있습니다'}
                </div>
              </div>
              <Switch
                checked={banner.isActive}
                disabled={isToggling}
                onCheckedChange={checked => onToggle(banner.id, checked)}
              />
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={() => onEdit(banner)}>
              <LuPencil className="mr-2 h-4 w-4" />
              수정
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              <LuTrash2 className="mr-2 h-4 w-4" />
              삭제
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
