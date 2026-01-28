'use client'

import { useState } from 'react'

import { LuChevronRight, LuImage, LuTrendingUp } from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

import { useTopBannersQuery, useTopLecturesQuery } from '../../hooks/use-analytics'
import { type Period } from './shared/period-toggle'

type ModalType = 'banners' | 'lectures' | null

interface ClickRankingSectionProps {
  period?: Period
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <span
      className={cn(
        'inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold sm:h-6 sm:w-6 sm:text-xs',
        rank === 1 && 'bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/30',
        rank === 2 && 'bg-linear-to-br from-gray-300 to-gray-400 text-white',
        rank === 3 && 'bg-linear-to-br from-orange-300 to-orange-400 text-white',
        rank > 3 && 'bg-muted text-muted-foreground',
      )}
    >
      {rank}
    </span>
  )
}

function SkeletonRows() {
  return (
    <>
      {[1, 2, 3].map(i => (
        <TableRow key={i}>
          <TableCell>
            <div className="bg-muted h-6 w-6 animate-pulse rounded-full" />
          </TableCell>
          <TableCell>
            <div className="bg-muted h-4 w-32 animate-pulse rounded" />
          </TableCell>
          <TableCell>
            <div className="bg-muted h-4 w-12 animate-pulse rounded" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export function ClickRankingSection({ period = 7 }: ClickRankingSectionProps) {
  const [modalOpen, setModalOpen] = useState<ModalType>(null)

  const { data: allBanners = [], isLoading: bannersLoading } = useTopBannersQuery(period, 50)
  const { data: allLectures = [], isLoading: lecturesLoading } = useTopLecturesQuery(period, 50)

  const banners = allBanners.slice(0, 5)
  const lectures = allLectures.slice(0, 5)

  const getPeriodLabel = (p: Period) => {
    switch (p) {
      case 1:
        return '오늘'
      case 7:
        return '이번 주'
      case 30:
        return '이번 달'
      default:
        return '이번 주'
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

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        {/* 배너 클릭 Top 5 */}
        <div className="bento-card group relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-pink-500/5" />
          <div className="grid-pattern absolute inset-0 opacity-30" />
          <div className="absolute -top-8 -right-8 h-20 w-20 rounded-full bg-purple-500/10 blur-2xl sm:-top-10 sm:-right-10 sm:h-28 sm:w-28" />

          <div className="relative z-10 flex h-full flex-col p-3 sm:p-5">
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-purple-500/10 p-1.5 sm:p-2">
                  <LuImage className="h-3.5 w-3.5 text-purple-600 sm:h-4 sm:w-4" />
                </div>
                <div>
                  <h3 className="text-foreground text-xs font-bold sm:text-sm">배너 클릭 Top 5</h3>
                  <p className="text-muted-foreground text-[9px] sm:text-[10px]">{periodLabel} 기준</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-muted-foreground w-10 text-[10px] sm:w-12 sm:text-xs">순위</TableHead>
                    <TableHead className="text-muted-foreground w-auto text-[10px] sm:text-xs">배너명</TableHead>
                    <TableHead className="text-muted-foreground w-14 text-right text-[10px] sm:w-16 sm:text-xs">
                      클릭
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bannersLoading ? (
                    <SkeletonRows />
                  ) : banners.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-muted-foreground py-6 text-center text-xs sm:py-8 sm:text-sm"
                      >
                        데이터가 없습니다
                      </TableCell>
                    </TableRow>
                  ) : (
                    banners.map((banner, idx) => (
                      <TableRow key={`${banner.bannerId}-${idx}`} className="hover:bg-card/50">
                        <TableCell className="py-2 sm:py-3">
                          <RankBadge rank={idx + 1} />
                        </TableCell>
                        <TableCell className="max-w-0 py-2 sm:py-3">
                          <div className="truncate" title={banner.bannerName || `배너 #${banner.bannerId}`}>
                            <span className="text-foreground text-xs font-medium sm:text-sm">
                              {banner.bannerName || `배너 #${banner.bannerId}`}
                            </span>
                            <span className="text-muted-foreground ml-1 hidden text-xs sm:inline">
                              ({getBannerTypeLabel(banner.bannerType)})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-right sm:py-3">
                          <span className="font-mono-data text-foreground text-xs font-semibold sm:text-sm">
                            {banner.clickCount.toLocaleString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {banners.length >= 5 && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="mt-2 w-full text-xs text-purple-600 hover:bg-purple-50 hover:text-purple-700 sm:mt-3 sm:text-sm"
                onClick={() => setModalOpen('banners')}
              >
                전체 보기 <LuChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* 강의 클릭 Top 5 */}
        <div className="bento-card group relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-teal-500/5" />
          <div className="grid-pattern absolute inset-0 opacity-30" />
          <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-emerald-500/10 blur-2xl sm:-bottom-10 sm:-left-10 sm:h-28 sm:w-28" />

          <div className="relative z-10 flex h-full flex-col p-3 sm:p-5">
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-emerald-500/10 p-1.5 sm:p-2">
                  <LuTrendingUp className="h-3.5 w-3.5 text-emerald-600 sm:h-4 sm:w-4" />
                </div>
                <div>
                  <h3 className="text-foreground text-xs font-bold sm:text-sm">인기 강의 Top 5</h3>
                  <p className="text-muted-foreground text-[9px] sm:text-[10px]">{periodLabel} 기준</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-muted-foreground w-8 text-[10px] sm:w-10 sm:text-xs">순위</TableHead>
                    <TableHead className="text-muted-foreground w-auto text-[10px] sm:text-xs">강의명</TableHead>
                    <TableHead className="text-muted-foreground hidden w-12 text-right text-xs sm:table-cell">
                      조회
                    </TableHead>
                    <TableHead className="text-muted-foreground w-10 text-right text-[10px] sm:text-xs">신청</TableHead>
                    <TableHead className="text-muted-foreground w-10 text-right text-[10px] sm:text-xs">공유</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lecturesLoading ? (
                    <SkeletonRows />
                  ) : lectures.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-muted-foreground py-6 text-center text-xs sm:py-8 sm:text-sm"
                      >
                        데이터가 없습니다
                      </TableCell>
                    </TableRow>
                  ) : (
                    lectures.map((lecture, idx) => (
                      <TableRow key={`${lecture.lectureId}-${idx}`} className="hover:bg-card/50">
                        <TableCell className="py-2 sm:py-3">
                          <RankBadge rank={idx + 1} />
                        </TableCell>
                        <TableCell className="max-w-0 py-2 sm:py-3">
                          <div className="truncate" title={lecture.lectureName || `강의 #${lecture.lectureId}`}>
                            <span className="text-foreground text-xs font-medium sm:text-sm">
                              {lecture.lectureName || `강의 #${lecture.lectureId}`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground hidden py-2 text-right text-xs sm:table-cell sm:py-3">
                          {(lecture.views || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="py-2 text-right sm:py-3">
                          <span className="font-mono-data text-xs font-semibold text-blue-600 sm:text-sm">
                            {lecture.applyClicks.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="py-2 text-right sm:py-3">
                          <span className="font-mono-data text-xs font-semibold text-emerald-600 sm:text-sm">
                            {lecture.shareClicks.toLocaleString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {lectures.length >= 5 && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="mt-2 w-full text-xs text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 sm:mt-3 sm:text-sm"
                onClick={() => setModalOpen('lectures')}
              >
                전체 보기 <LuChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 배너 전체 보기 모달 */}
      <Dialog open={modalOpen === 'banners'} onOpenChange={open => !open && setModalOpen(null)}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <LuImage className="h-5 w-5 text-purple-600" />
              </div>
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
                  <TableRow key={`${banner.bannerId}-${idx}`}>
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
                    <TableCell className="font-mono-data text-right font-semibold">
                      {banner.clickCount.toLocaleString()}
                    </TableCell>
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
              <div className="rounded-lg bg-emerald-500/10 p-2">
                <LuTrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
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
                  <TableRow key={`${lecture.lectureId}-${idx}`}>
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
                    <TableCell className="font-mono-data text-right font-semibold text-blue-600">
                      {lecture.applyClicks.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono-data text-right font-semibold text-emerald-600">
                      {lecture.shareClicks.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono-data text-right font-bold">
                      {lecture.totalClicks.toLocaleString()}
                    </TableCell>
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
