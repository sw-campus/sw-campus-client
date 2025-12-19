import { MemberStatusData } from '..'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const mockData: MemberStatusData[] = [
  { status: '전체회원', count: 2500, color: 'bg-foreground' },
  { status: '활동중', count: 1800, color: 'bg-chart-1' },
  { status: '신규가입', count: 320, color: 'bg-chart-2' },
  { status: '로그인 미활', count: 280, color: 'bg-chart-3' },
  { status: '탈퇴예정', count: 100, color: 'bg-destructive' },
]

export function MemberStatusTable() {
  const maxCount = Math.max(...mockData.map(d => d.count))

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">회원 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">상태</TableHead>
              <TableHead>현황</TableHead>
              <TableHead className="text-right">인원</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map(row => (
              <TableRow key={row.status}>
                <TableCell className="text-foreground font-medium">{row.status}</TableCell>
                <TableCell>
                  <div className="bg-muted h-4 w-full overflow-hidden rounded-full">
                    <div
                      className={`h-full rounded-full ${row.color}`}
                      style={{ width: `${(row.count / maxCount) * 100}%` }}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-right">{row.count.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
