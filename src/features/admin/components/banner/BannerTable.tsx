'use client'

import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Switch } from '@/components/ui/Switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
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
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-foreground text-base sm:text-lg">배너 목록</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
        <div className="-mx-3 overflow-x-auto sm:mx-0">
          <Table className="min-w-[550px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] text-xs sm:w-[60px] sm:text-sm">NO</TableHead>
                <TableHead className="w-[60px] text-xs sm:w-[100px] sm:text-sm">타입</TableHead>
                <TableHead className="min-w-[100px] text-xs sm:text-sm">강의명</TableHead>
                <TableHead className="w-[120px] text-xs sm:w-[200px] sm:text-sm">기간</TableHead>
                <TableHead className="w-[70px] text-center text-xs sm:w-[110px] sm:text-sm">기간상태</TableHead>
                <TableHead className="w-[60px] text-center text-xs sm:w-[90px] sm:text-sm">활성화</TableHead>
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
                    <TableCell className="text-muted-foreground text-xs sm:text-sm">{index + 1}</TableCell>
                    <TableCell>
                      <TypeBadge type={banner.type} />
                    </TableCell>
                    <TableCell className="text-foreground max-w-[100px] truncate text-xs font-medium sm:max-w-none sm:text-sm" title={banner.lectureName}>
                      {banner.lectureName}
                    </TableCell>
                    <TableCell className="text-muted-foreground truncate text-xs sm:text-sm">
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
