'use client'

import { useState } from 'react'

import { LuImage, LuTrendingUp } from 'react-icons/lu'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { useTopBannersQuery, useTopLecturesQuery } from '../hooks/useAnalytics'

type Period = 7 | 30

export function ClickRankingSection() {
  const [period, setPeriod] = useState<Period>(7)
  const { data: banners = [], isLoading: bannersLoading } = useTopBannersQuery(period, 5)
  const { data: lectures = [], isLoading: lecturesLoading } = useTopLecturesQuery(period, 5)

  const PeriodToggle = () => (
    <div className="flex rounded-lg bg-gray-100 p-1">
      <button
        onClick={() => setPeriod(7)}
        className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
          period === 7 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        7일
      </button>
      <button
        onClick={() => setPeriod(30)}
        className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
          period === 30 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        30일
      </button>
    </div>
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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* 배너 클릭 Top 5 */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <LuImage className="h-5 w-5 text-purple-500" />
            배너 클릭 Top 5
          </CardTitle>
          <PeriodToggle />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">순위</TableHead>
                <TableHead>배너명</TableHead>
                <TableHead className="w-20 text-right">클릭</TableHead>
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
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${
                          idx === 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : idx === 1
                              ? 'bg-gray-200 text-gray-600'
                              : idx === 2
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-gray-50 text-gray-500'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="line-clamp-1">{banner.bannerName || `배너 #${banner.bannerId}`}</span>
                      <span className="text-muted-foreground ml-2 text-xs">({banner.bannerType})</span>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{banner.clickCount.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 강의 클릭 Top 5 */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <LuTrendingUp className="h-5 w-5 text-emerald-500" />
            인기 강의 Top 5
          </CardTitle>
          <span className="text-muted-foreground text-sm">최근 {period}일</span>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">순위</TableHead>
                <TableHead>강의명</TableHead>
                <TableHead className="w-16 text-right">신청</TableHead>
                <TableHead className="w-16 text-right">공유</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lecturesLoading ? (
                <SkeletonRows />
              ) : lectures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground text-center">
                    데이터가 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                lectures.map((lecture, idx) => (
                  <TableRow key={lecture.lectureId}>
                    <TableCell className="font-medium">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${
                          idx === 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : idx === 1
                              ? 'bg-gray-200 text-gray-600'
                              : idx === 2
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-gray-50 text-gray-500'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="line-clamp-1">{lecture.lectureName || `강의 #${lecture.lectureId}`}</span>
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
        </CardContent>
      </Card>
    </div>
  )
}
