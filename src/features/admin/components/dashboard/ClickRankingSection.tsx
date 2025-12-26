'use client'

import { useState } from 'react'

import { LuChevronRight, LuImage, LuTrendingUp } from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { useTopBannersQuery, useTopLecturesQuery } from '../../hooks/useAnalytics'
import { type Period } from './shared/PeriodToggle'

type ModalType = 'banners' | 'lectures' | null

interface ClickRankingSectionProps {
  period?: Period
}

export function ClickRankingSection({ period = 7 }: ClickRankingSectionProps) {
  const [modalOpen, setModalOpen] = useState<ModalType>(null)

  // 전체 데이터 조회 (limit=50) - 카드와 모달에서 공유
  const { data: allBanners = [], isLoading: bannersLoading } = useTopBannersQuery(period, 50)
  const { data: allLectures = [], isLoading: lecturesLoading } = useTopLecturesQuery(period, 50)

  // 카드용: Top 5 (slice로 추출)
  const banners = allBanners.slice(0, 5)
  const lectures = allLectures.slice(0, 5)

  const getPeriodLabel = (p: Period) => {
    switch (p) {
      case 1:
        return '일간' // or '지난 1일'
      case 7:
        return '주간'
      case 30:
        return '월간'
      default:
        return '주간'
    }
  }

  const getBannerTypeLabel = (type: string) => {
    const t = type.toLowerCase()
    switch (t) {
      case 'big':
        return '대형'
      case 'middle':
        return '중형'
      case 'small':
        return '소형'
      default:
        return type
    }
  }

  const periodLabel = getPeriodLabel(period)

  const RankBadge = ({ rank }: { rank: number }) => (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${
        rank === 1
          ? 'bg-yellow-100 text-yellow-700'
          : rank === 2
            ? 'bg-gray-200 text-gray-600'
            : rank === 3
              ? 'bg-orange-100 text-orange-600'
              : 'bg-gray-50 text-gray-500'
      }`}
    >
      {rank}
    </span>
  )

  const SkeletonRows = () => (
    <>
      {[1, 2, 3].map(i => (
        <TableRow key={i}>
          <TableCell>
            <div className="h-4 w-6 animate-pulse rounded bg-gray-200" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 배너 클릭 Top 5 */}
        <Card className="bg-card flex h-full flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground flex items-center gap-2">
              <LuImage className="h-5 w-5 text-purple-500" />
              배너 클릭 Top 5
            </CardTitle>
            <span className="text-muted-foreground text-sm">{periodLabel} 기준</span>
          </CardHeader>
          <CardContent>
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">순위</TableHead>
                  <TableHead className="w-auto">배너명</TableHead>
                  <TableHead className="w-16 text-right">클릭</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bannersLoading ? (
                  <SkeletonRows />
                ) : banners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-muted-foreground text-center">
                      데이터가 없습니다
                    </TableCell>
                  </TableRow>
                ) : (
                  banners.map((banner, idx) => (
                    <TableRow key={banner.bannerId}>
                      <TableCell className="font-medium">
                        <RankBadge rank={idx + 1} />
                      </TableCell>
                      <TableCell className="max-w-0">
                        <div className="truncate" title={banner.bannerName || `배너 #${banner.bannerId}`}>
                          {banner.bannerName || `배너 #${banner.bannerId}`}
                          <span className="text-muted-foreground ml-1 text-xs">
                            ({getBannerTypeLabel(banner.bannerType)})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{banner.clickCount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {banners.length >= 5 && (
              <Button
                variant="ghost"
                className="mt-2 w-full text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                onClick={() => setModalOpen('banners')}
              >
                전체 보기 <LuChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* 강의 클릭 Top 5 */}
        <Card className="bg-card flex h-full flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground flex items-center gap-2">
              <LuTrendingUp className="h-5 w-5 text-emerald-500" />
              인기 강의 Top 5
            </CardTitle>
            <span className="text-muted-foreground text-sm">{periodLabel} 기준</span>
          </CardHeader>
          <CardContent>
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">순위</TableHead>
                  <TableHead className="w-auto">강의명</TableHead>
                  <TableHead className="w-12 text-right">조회</TableHead>
                  <TableHead className="w-10 text-right">신청</TableHead>
                  <TableHead className="w-10 text-right">공유</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lecturesLoading ? (
                  <SkeletonRows />
                ) : lectures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground text-center">
                      데이터가 없습니다
                    </TableCell>
                  </TableRow>
                ) : (
                  lectures.map((lecture, idx) => (
                    <TableRow key={lecture.lectureId}>
                      <TableCell className="font-medium">
                        <RankBadge rank={idx + 1} />
                      </TableCell>
                      <TableCell className="max-w-0">
                        <div className="truncate" title={lecture.lectureName || `강의 #${lecture.lectureId}`}>
                          {lecture.lectureName || `강의 #${lecture.lectureId}`}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-right text-sm">
                        {(lecture.views || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-blue-600">
                        {lecture.applyClicks.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600">
                        {lecture.shareClicks.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {lectures.length >= 5 && (
              <Button
                variant="ghost"
                className="mt-2 w-full text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                onClick={() => setModalOpen('lectures')}
              >
                전체 보기 <LuChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 배너 전체 보기 모달 */}
      <Dialog open={modalOpen === 'banners'} onOpenChange={open => !open && setModalOpen(null)}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LuImage className="h-5 w-5 text-purple-500" />
              배너 클릭 순위 (최근 {period}일)
            </DialogTitle>
          </DialogHeader>
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">순위</TableHead>
                <TableHead className="w-auto">배너명</TableHead>
                <TableHead className="w-20">타입</TableHead>
                <TableHead className="w-16 text-right">클릭</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bannersLoading ? (
                <SkeletonRows />
              ) : allBanners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground text-center">
                    데이터가 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                allBanners.map((banner, idx) => (
                  <TableRow key={banner.bannerId}>
                    <TableCell>
                      <RankBadge rank={idx + 1} />
                    </TableCell>
                    <TableCell className="max-w-0">
                      <div className="truncate font-medium" title={banner.bannerName || `배너 #${banner.bannerId}`}>
                        {banner.bannerName || `배너 #${banner.bannerId}`}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {getBannerTypeLabel(banner.bannerType)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">{banner.clickCount.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {/* 강의 전체 보기 모달 */}
      <Dialog open={modalOpen === 'lectures'} onOpenChange={open => !open && setModalOpen(null)}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LuTrendingUp className="h-5 w-5 text-emerald-500" />
              인기 강의 순위 (최근 {period}일)
            </DialogTitle>
          </DialogHeader>
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">순위</TableHead>
                <TableHead className="w-auto">강의명</TableHead>
                <TableHead className="w-16 text-right">조회</TableHead>
                <TableHead className="w-14 text-right">신청</TableHead>
                <TableHead className="w-14 text-right">공유</TableHead>
                <TableHead className="w-14 text-right">합계</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lecturesLoading ? (
                <SkeletonRows />
              ) : allLectures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground text-center">
                    데이터가 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                allLectures.map((lecture, idx) => (
                  <TableRow key={lecture.lectureId}>
                    <TableCell>
                      <RankBadge rank={idx + 1} />
                    </TableCell>
                    <TableCell className="max-w-0">
                      <div className="truncate font-medium" title={lecture.lectureName || `강의 #${lecture.lectureId}`}>
                        {lecture.lectureName || `강의 #${lecture.lectureId}`}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right text-sm">
                      {(lecture.views || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-blue-600">
                      {lecture.applyClicks.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600">
                      {lecture.shareClicks.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold">{lecture.totalClicks.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </>
  )
}
