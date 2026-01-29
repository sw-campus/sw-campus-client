'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/lib/date'
import { cn } from '@/lib/utils'

import type { Banner, BannerType } from '../../types/banner.type'
import {
  BANNER_TYPE_LABEL,
  getBannerPeriodStatus,
  BANNER_PERIOD_STATUS_LABEL,
  BANNER_PERIOD_STATUS_COLOR,
} from '../../types/banner.type'

interface BannerTableProps {
  banners: Banner[]
  isLoading: boolean
  isToggling: boolean
  onViewDetail: (banner: Banner) => void
  onToggle: (id: number, isActive: boolean) => void
}

function TypeBadge({ type }: { type: BannerType }) {
  const colorClasses: Record<BannerType, string> = {
    BIG: 'bg-primary/10 text-primary',
    MIDDLE: 'bg-secondary text-secondary-foreground',
    SMALL: 'bg-muted text-muted-foreground',
    EVENT: 'bg-orange-100 text-orange-700',
  }

  return (
    <Badge variant="secondary" className={cn('font-medium', colorClasses[type])}>
      {BANNER_TYPE_LABEL[type]}
    </Badge>
  )
}

export function BannerTable({ banners, isLoading, isToggling, onViewDetail, onToggle }: BannerTableProps) {
  if (isLoading) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">배너 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground">로딩 중...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (banners.length === 0) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">배너 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground">해당 조건의 배너가 없습니다.</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card">
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="text-foreground text-base md:text-lg">배너 목록</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
        <div className="-mx-3 overflow-x-auto md:mx-0">
          <Table className="min-w-[550px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] text-xs md:w-[60px] md:text-sm">NO</TableHead>
                <TableHead className="w-[60px] text-xs md:w-[100px] md:text-sm">타입</TableHead>
                <TableHead className="min-w-[100px] text-xs md:text-sm">강의명</TableHead>
                <TableHead className="w-[120px] text-xs md:w-[200px] md:text-sm">기간</TableHead>
                <TableHead className="w-[70px] text-center text-xs md:w-[110px] md:text-sm">기간상태</TableHead>
                <TableHead className="w-[60px] text-center text-xs md:w-[90px] md:text-sm">활성화</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner, index) => {
                const periodStatus = getBannerPeriodStatus(banner.startDate, banner.endDate)
                return (
                  <TableRow
                    key={banner.id}
                    onClick={() => onViewDetail(banner)}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <TableCell className="text-muted-foreground text-xs md:text-sm">{index + 1}</TableCell>
                    <TableCell>
                      <TypeBadge type={banner.type} />
                    </TableCell>
                    <TableCell
                      className="max-w-[100px] truncate text-xs font-medium md:max-w-none md:text-sm"
                      title={banner.lectureName || undefined}
                    >
                      {banner.lectureName ? (
                        <span className="text-foreground">{banner.lectureName}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground truncate text-xs md:text-sm">
                      {formatDate(banner.startDate)} ~ {formatDate(banner.endDate)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className={cn('font-medium', BANNER_PERIOD_STATUS_COLOR[periodStatus])}>
                        {BANNER_PERIOD_STATUS_LABEL[periodStatus]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div onClick={e => e.stopPropagation()}>
                        <Switch
                          checked={banner.isActive}
                          disabled={isToggling}
                          onCheckedChange={checked => onToggle(banner.id, checked)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
