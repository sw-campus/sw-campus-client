'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { DeviceStat } from '../../api/analyticsApi'

interface DeviceDonutChartProps {
  data?: DeviceStat[]
  isLoading?: boolean
}

const COLORS = {
  desktop: '#3b82f6', // Blue
  mobile: '#10b981', // Emerald
  tablet: '#f59e0b', // Amber
}

export function DeviceDonutChart({ data, isLoading }: DeviceDonutChartProps) {
  const chartData =
    data?.map(stat => ({
      name: stat.category,
      value: stat.activeUsers,
      color: COLORS[stat.category.toLowerCase() as keyof typeof COLORS] || '#94a3b8',
    })) ?? []

  if (isLoading) {
    return (
      <Card className="bg-card h-full">
        <CardHeader>
          <CardTitle className="text-foreground">기기별 접속</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <span className="text-muted-foreground text-sm">로딩 중...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-foreground">기기별 접속</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        {chartData.length > 0 ? (
          <>
            <div className="h-[200px] w-[200px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map(entry => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2">
              {chartData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground text-sm whitespace-nowrap">
                    {item.name}: {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <span className="text-muted-foreground text-sm">데이터가 없습니다</span>
        )}
      </CardContent>
    </Card>
  )
}
