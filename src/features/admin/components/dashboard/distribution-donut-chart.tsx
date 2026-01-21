'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface DonutChartDataItem {
  name: string
  value: number
  color: string
  [key: string]: string | number
}

interface DistributionDonutChartProps {
  data: DonutChartDataItem[]
  isLoading?: boolean
}

export function DistributionDonutChart({ data, isLoading }: DistributionDonutChartProps) {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)

  if (isLoading || totalValue === 0) {
    return (
      <Card className="bg-card h-full">
        <CardHeader>
          <CardTitle className="text-foreground">회원 분포</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <span className="text-muted-foreground text-sm">{isLoading ? '로딩 중...' : '데이터가 없습니다'}</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-foreground">회원 분포</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <div className="h-[200px] w-[200px] shrink-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                {data.map(entry => (
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
          {data.map(item => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground text-sm whitespace-nowrap">
                {item.name}: {item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
